// src/app/api/pickups/route.js
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// --- GET: Fetch all pickup requests for the Admin dashboard ---
export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Authorization Check: Ensure the user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
  }

  // Fetch all pickups. We use 'select' with a foreign table join 
  // to get the user's name/email alongside the pickup data.
  const { data: pickups, error } = await supabase
    .from('pickup_schedule') // Using your existing table name
    .select('*, profiles(name, email)') // Fetch all columns, plus name and email from the linked 'profiles' table
    .order('created_at', { ascending: false }); // Show newest requests first

  if (error) {
    console.error('Pickups fetch error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Return the full list of pickup requests
  return new Response(JSON.stringify(pickups), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// NOTE: A POST request could be added here to handle new pickup submissions 
// from the community/unauthenticated users.