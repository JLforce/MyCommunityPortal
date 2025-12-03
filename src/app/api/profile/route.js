// src/app/api/profile/route.js
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// --- GET: Fetch the current admin's profile data ---
export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Get the current authenticated user's ID
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
  }

  // 2. Fetch the profile corresponding to the user's ID
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, email') // Select the fields needed for the profile page
    .eq('id', user.id) // IMPORTANT: The 'id' column in the 'profiles' table should match auth.users.id
    .single();

  if (error) {
    console.error('Profile fetch error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // 3. Return the profile data
  return new Response(JSON.stringify(profile), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// --- PUT: Update the current admin's profile data ---
export async function PUT(request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const updateData = await request.json();

    // 1. Perform the update operation on the user's corresponding profile row
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData) // Update with name, avatar_url, etc.
      .eq('id', user.id)  // Crucial security check: Only update the current user's profile
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error.message);
      throw new Error(error.message);
    }

    // 2. Return the newly updated profile data
    return new Response(JSON.stringify(updatedProfile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}