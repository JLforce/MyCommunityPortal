'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function signUp(formData) {
  // --- DEBUG: Log all form data received ---
  console.log('--- Received form data ---');
  formData.forEach((value, key) => console.log(`${key}: ${value}`));

  const email = formData.get('email')?.trim()
  const password = formData.get('password')
  const confirm = formData.get('confirm')
  const firstName = formData.get('first_name')?.trim()
  const lastName = formData.get('last_name')?.trim()
  const phone = formData.get('phone')?.trim()
  const street = formData.get('street_address')?.trim()
  const city = formData.get('city')?.trim()
  const zip = formData.get('zip_code')?.trim()
  const role = formData.get('role')?.trim()

  if (!email || !password || !confirm || !firstName || !lastName || !phone || !street || !city || !zip || !role) {
    return { error: 'Please fill in all required fields.' }
  }

  if (password !== confirm) {
    return { error: 'Passwords do not match' }
  }

  const cookieStore = cookies()
  let supabase
  try {
    supabase = createClient(cookieStore)
  } catch (err) {
    console.error('Supabase client error:', err.message)
    return { error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    /*options: {
      emailRedirectTo: `${new URL(process.env.NEXT_PUBLIC_SITE_URL).origin}/auth/callback`,
    }*/
  })

  if (error) {
    return { error: error.message }
  }

  // --- DEBUG: Log the user object from Supabase Auth ---
  console.log('--- Supabase auth user created ---', data.user);

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

  // Extra validation: log and abort if any required profile field is null/empty
  const requiredProfileFields = ['id', 'first_name', 'last_name', 'email', 'phone', 'street_address', 'city', 'zip_code', 'role']
  const missingFields = requiredProfileFields.filter(key => profileData[key] === undefined || profileData[key] === null || (typeof profileData[key] === 'string' && profileData[key].trim() === ''))
  if (missingFields.length > 0) {
    console.error('Aborting profile insert - missing/empty fields:', missingFields)
    console.error('Profile data snapshot:', profileData)
    return { error: `Missing required profile fields: ${missingFields.join(', ')}` }
  }

  // --- DEBUG: Log the profile data object before insertion ---
  console.log('--- Profile data to be inserted ---', profileData);

  // Insert profile data immediately.
  // Insert profile data immediately and log the response for debugging
  const { data: insertedProfile, error: insertError } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()

  // Log result of insert for debugging
  console.log('--- Profile insert result ---', { insertedProfile, insertError })

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
  let supabase
  try {
    supabase = createClient(cookieStore)
  } catch (err) {
    console.error('Supabase client error:', err.message)
    return { error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }
  }

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

  // DEBUG: Log successful signin
  console.log('--- User signed in successfully ---', data.user.id);

  // After sign in, read the profile role and redirect appropriately
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile after sign in:', profileError.message || profileError);
    }

    const role = (profileData?.role || '').toString().toLowerCase();
    revalidatePath('/', 'layout');

    // If the user is a city authority/official, redirect to the admin dashboard
    if (role === 'city official' || role === 'city authority' || role === 'city_authority' || role === 'admin') {
      redirect('/dashboard-admin');
    }

    // Default redirect for normal users
    redirect('/dashboard');
  } catch (e) {
    console.error('Error in post-signin redirect logic:', e);
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  }
}

export async function signOut() {
  const cookieStore = cookies()
  let supabase
  try {
    supabase = createClient(cookieStore)
  } catch (err) {
    console.error('Supabase client error:', err.message)
    return { error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' }
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/signin')
}
