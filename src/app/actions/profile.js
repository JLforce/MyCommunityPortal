// app/actions/profile.js (New File)
'use server'

import { cookies } from 'next/headers'
import { createClient } from '../../lib/supabase/server' // Adjust path if needed
import { redirect } from 'next/navigation'

/**
 * Reads the pending_profile cookie and inserts the data into the profiles table.
 * This should be called after a user has successfully signed in (e.g., after email confirmation).
 */
export async function insertPendingProfile() {
  const cookieStore = cookies()
  const profileCookie = cookieStore.get('pending_profile')

  if (!profileCookie) {
    // No pending profile data found, just return without redirecting
    return
  }

  const profileData = JSON.parse(profileCookie.value)
  const supabase = createClient(cookieStore)

  // 1. Verify the user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== profileData.id) {
    // If user is not logged in or the logged-in user doesn't match the cookie ID, stop.
    // This is a safety check.
    return { error: 'User session mismatch or not logged in.' }
  }

  // 2. Insert or update the profile data
  try {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone,
        street_address: profileData.street_address,
        city: profileData.city,
        zip_code: profileData.zip_code,
        role: profileData.role,
      })
      .select()

    if (insertError) {
      if (insertError.code === '23505') { // duplicate key error
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            phone: profileData.phone,
            street_address: profileData.street_address,
            city: profileData.city,
            zip_code: profileData.zip_code,
            role: profileData.role,
          })
          .eq('id', profileData.id)
          .select()

        if (updateError) {
          console.error('Failed to update profile:', updateError.message)
        }
      } else {
        console.error('Failed to insert profile:', insertError.message)
      }
    }
  } catch (err) {
    console.error('Error in profile insertion:', err)
  } finally {
    // 3. Clear the cookie
    cookieStore.delete('pending_profile')
  }
}
