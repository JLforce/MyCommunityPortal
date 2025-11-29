'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// Example function to fetch data from a table
export async function getData(tableName) {
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
