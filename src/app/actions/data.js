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
  let query = supabase
    .from('reports')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  if (municipality) {
    query = query.eq('municipality', municipality)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { data }
}
