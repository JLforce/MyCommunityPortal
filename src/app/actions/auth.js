'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function signUp(formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const confirm = formData.get('confirm')
  const firstName = formData.get('first_name')
  const lastName = formData.get('last_name')
  const phone = formData.get('phone')
  const street = formData.get('street_address')
  const city = formData.get('city')
  const zip = formData.get('zip_code')
  const role = formData.get('role')

  if (password !== confirm) {
    return { error: 'Passwords do not match' }
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const profileData = {
    id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    street_address: street,
    city,
    zip_code: zip,
    role,
  }

  // Insert profile data immediately using upsert to handle existing rows from trigger
  const { error: insertError } = await supabase
    .from('profiles')
    .upsert(profileData)
  if (insertError) {
    console.error('Failed to insert profile:', insertError.message)
    return { error: 'Account created but profile insertion failed. Please contact support.' }
  }

  revalidatePath('/', 'layout')
  return { success: 'Account created successfully. Please check your email for confirmation if required.' }
}

export async function signIn(formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Customize error messages for better user experience
    if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
      return { error: 'Email or password is incorrect, or account does not exist.' }
    }
    if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
      return { error: 'Please confirm your email before signing in.' }
    }
    return { error: error.message }
  }

  // Additional check if session is not established (for cases where signIn succeeds but session fails)
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    return { error: 'Please confirm your email before signing in.' }
  }

  // Insert pending profile data if exists (from signup)
  const { insertPendingProfile } = await import('./profile')
  await insertPendingProfile()

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/signin')
}
