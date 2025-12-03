// src/app/api/settings/route.js
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// --- GET: Fetch the current global settings (always ID 1) ---
export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // 1. Fetch the user to perform an authorization check (ensure only admin can access)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
  }

  // NOTE: You should add logic here to check if 'user' is actually an admin. 
  // For now, we assume any authenticated user is allowed to view settings.

  // 2. Fetch the single row from the admin_settings table
  const { data: settings, error } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('id', 1) // We only expect one row, with ID 1
    .maybeSingle(); // Use maybeSingle to get an object or null

  if (error) {
    console.error('Settings fetch error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  
  // Handle case where settings table is empty
  if (!settings) {
     return new Response(JSON.stringify({ error: 'Settings not initialized. Insert the first row (ID=1) manually in Supabase.' }), { status: 404 });
  }

  // 3. Return the settings data to the frontend
  return new Response(JSON.stringify(settings), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// --- PUT: Update the global settings (always ID 1) ---
export async function PUT(request) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  
  // Parse the new settings data from the request body
  const newSettings = await request.json();

  // 1. Define the payload, making sure to update the update_at timestamp
  const updatePayload = {
      ...newSettings,
      update_at: new Date().toISOString()
  };

  // 2. Update the single settings row with ID 1
  const { data, error } = await supabase
    .from('admin_settings')
    .update(updatePayload)
    .eq('id', 1) // Crucial: Only update the row with ID 1
    .select() // Select the updated row to return it
    .single();

  if (error) {
    console.error('Settings update error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // 3. Return the newly saved settings data
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}