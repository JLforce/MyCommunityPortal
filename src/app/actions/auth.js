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

  // normalize role for consistent storage (e.g. 'City Official' -> 'city_official')
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')

  const profileData = {
    id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    street_address: street,
    city,
    zip_code: zip,
    role: normalizedRole,
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

  // After creating profile, revalidate and handle post-signup redirect logic.
  revalidatePath('/', 'layout')

  // If the user signed up as an admin/city official, attempt to sign them in
  // automatically and redirect to the admin dashboard. If sign-in fails
  // because email confirmation is required, fall back to the normal
  // success message so the user can confirm and then sign in.
  const adminRoles = ['city_official', 'city_authority', 'admin']
  if (adminRoles.includes(normalizedRole) || normalizedRole.includes('official')) {
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!signInError) {
        // verify session established
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session) {
          revalidatePath('/', 'layout')
          redirect('/dashboard-admin')
        }
      }
    } catch (err) {
      console.warn('Auto sign-in failed (non-blocking):', err?.message || err)
    }
    // If we reach here, auto sign-in didn't succeed (likely email confirmation required).
    return { success: 'Account created successfully. Please confirm your email (if required) and sign in.' }
  }

  return { success: 'Account created successfully. Please check your email for confirmation if required.' }
}

export async function signIn(formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const roleHint = (formData.get('role_hint') || '')?.toString().toLowerCase();

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
    // normalize fetched role to a predictable form (underscores)
    const normRole = role.replace(/\s+/g, '_').replace(/-/g, '_');
    revalidatePath('/', 'layout');

    // If the request contained a role hint (click from 'Sign In as City Official'),
    // prefer redirecting to the admin dashboard after successful sign-in.
    if (roleHint === 'city_official' || roleHint.includes('official')) {
      redirect('/dashboard-admin');
    }

    // If the user's stored role indicates admin/official, redirect to admin dashboard
    if (normRole === 'city_official' || normRole === 'city_authority' || normRole === 'admin' || normRole.includes('official')) {
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
