'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Example function to fetch data from a table
export async function getData(tableName) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from(tableName)
    .select('*')

  if (error) {
    return { error: error.message }
  }

  return { data }
}

// Example function to insert data into a table
export async function insertData(tableName, data) {
  // DEBUG: if writing to profiles, log payload
  if (tableName === 'profiles') console.log('insertData: profiles payload', data)

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: insertedData, error } = await supabase
    .from(tableName)
    .insert(data)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { data: insertedData }
}

// Example function to update data in a table
export async function updateData(tableName, id, updates) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { data }
}

// Example function to delete data from a table
export async function deleteData(tableName, id) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

// Function to get user profile by user ID
export async function getProfile(userId) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getPickupsCount() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { count, error } = await supabase
    .from('pickup_schedule')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return { error: error.message }
  }

  return { count }
}

export async function getPendingReportsCount(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  let query = supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'under-review', 'under_review'])
  
  if (municipality) {
    query = query.eq('municipality', municipality)
  }

  const { count, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { count }
}

export async function getResolvedIssuesCount(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  let query = supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')

  if (municipality) {
    query = query.eq('municipality', municipality)
  }

  const { count, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { count }
}

export async function getUsersCount(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (municipality) {
    query = query.eq('municipality', municipality)
  }

  const { count, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { count }
}

export async function getRecentActivity(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Get today's date (start of day) to filter out past pickups
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString().split('T')[0]
  
  // Get recent reports
  let reportsQuery = supabase
    .from('reports')
    .select('id, issue_type, status, created_at, user_id, municipality, profiles(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(10) // Fetch more to account for filtering

  if (municipality) {
    reportsQuery = reportsQuery.eq('municipality', municipality)
  }

  const { data: reports, error: reportsError } = await reportsQuery

  // Get recent pickups (only future or today's pickups, fetch more to account for filtering)
  let pickupsQuery = supabase
    .from('pickup_schedule')
    .select('id, pickup_type, pickup_date, created_at, user_id, profiles(first_name, last_name, municipality)')
    .gte('pickup_date', todayISO) // Only get pickups from today onwards
    .order('created_at', { ascending: false })
    .limit(20) // Fetch more to account for municipality filtering

  const { data: allPickups, error: pickupsError } = await pickupsQuery
  
  // Filter by municipality if provided
  let pickups = allPickups
  if (municipality && allPickups) {
    pickups = allPickups.filter(p => p.profiles?.municipality === municipality)
  }

  if (reportsError || pickupsError) {
    return { error: reportsError?.message || pickupsError?.message }
  }

  // Combine and format activities
  const activities = []
  
  // Add reports as activities
  if (reports) {
    reports.forEach(report => {
      const profile = report.profiles
      const fullName = profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous'
        : 'Anonymous'
      
      activities.push({
        id: `report-${report.id}`,
        type: 'report',
        title: `${report.issue_type} Report - ${report.status}`,
        user_name: fullName,
        created_at: report.created_at,
        raw: report
      })
    })
  }

  // Add pickups as activities (only future/today pickups)
  if (pickups) {
    pickups.forEach(pickup => {
      const profile = pickup.profiles
      const fullName = profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous'
        : 'Anonymous'
      
      const pickupDate = pickup.pickup_date ? new Date(pickup.pickup_date).toLocaleDateString() : 'N/A'
      
      activities.push({
        id: `pickup-${pickup.id}`,
        type: 'pickup',
        title: `${pickup.pickup_type || 'Waste'} Pickup Scheduled - ${pickupDate}`,
        user_name: fullName,
        created_at: pickup.created_at,
        raw: pickup
      })
    })
  }

  // Sort by created_at descending (LIFO - Last In First Out) and limit to 5
  activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return { data: activities.slice(0, 5) }
}

// Get completion rate for this week (resolved reports / total reports)
export async function getCompletionRate(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Get start of week (Monday)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)
  
  // Get total reports this week
  let totalQuery = supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfWeek.toISOString())

  if (municipality) {
    totalQuery = totalQuery.eq('municipality', municipality)
  }

  const { count: total, error: totalError } = await totalQuery

  // Get resolved reports this week
  let resolvedQuery = supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')
    .gte('created_at', startOfWeek.toISOString())

  if (municipality) {
    resolvedQuery = resolvedQuery.eq('municipality', municipality)
  }

  const { count: resolved, error: resolvedError } = await resolvedQuery

  if (totalError || resolvedError) {
    return { error: totalError?.message || resolvedError?.message }
  }

  const rate = total > 0 ? Math.round((resolved / total) * 100) : 0
  return { rate, total, resolved }
}

// Get waste collected percentage for this week (based on scheduled pickups)
export async function getWasteCollectedRate(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Get start of week (Monday)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)
  
  // Get pickups scheduled this week
  let pickupsQuery = supabase
    .from('pickup_schedule')
    .select('id, pickup_date, profiles(municipality)')
    .gte('pickup_date', startOfWeek.toISOString().split('T')[0])

  const { data: pickups, error: pickupsError } = await pickupsQuery

  if (pickupsError) {
    return { error: pickupsError.message }
  }

  // Filter by municipality if provided
  let filteredPickups = pickups
  if (municipality) {
    filteredPickups = pickups.filter(p => p.profiles?.municipality === municipality)
  }

  // Calculate rate based on target (assuming target is 100 pickups per week, adjust as needed)
  const target = 100
  const count = filteredPickups.length
  const rate = Math.min(Math.round((count / target) * 100), 100)
  
  return { rate, count, target }
}

// Get recyclables rate for this week (recyclable pickups / total pickups)
export async function getRecyclablesRate(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  // Get start of week (Monday)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)
  
  // Get all pickups this week
  let pickupsQuery = supabase
    .from('pickup_schedule')
    .select('id, pickup_type, pickup_date, profiles(municipality)')
    .gte('pickup_date', startOfWeek.toISOString().split('T')[0])

  const { data: pickups, error: pickupsError } = await pickupsQuery

  if (pickupsError) {
    return { error: pickupsError.message }
  }

  // Filter by municipality if provided
  let filteredPickups = pickups
  if (municipality) {
    filteredPickups = pickups.filter(p => p.profiles?.municipality === municipality)
  }

  // Count recyclable pickups (assuming pickup_type contains 'recyclable' or 'recycle')
  const recyclableTypes = ['recyclable', 'recycle', 'recycling']
  const recyclableCount = filteredPickups.filter(p => 
    recyclableTypes.some(type => 
      p.pickup_type?.toLowerCase().includes(type)
    )
  ).length

  const total = filteredPickups.length
  const rate = total > 0 ? Math.round((recyclableCount / total) * 100) : 0
  
  return { rate, recyclableCount, total }
}

// Get default pickup schedule for a municipality
export async function getDefaultSchedule(municipality) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  if (!municipality) {
    return { data: null }
  }

  // Get admin settings for the municipality
  // Note: admin_settings should have a municipality field to scope settings per municipality
  const { data: settings, error } = await supabase
    .from('admin_settings')
    .select('default_pickup_day, default_pickup_time, default_pickup_schedule')
    .eq('municipality', municipality)
    .maybeSingle()

  if (error) {
    return { error: error.message }
  }

  return { data: settings }
}
