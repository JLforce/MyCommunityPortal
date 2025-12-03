// src/app/api/pickups/[id]/route.js
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// --- PUT: Update a specific pickup request by ID ---
export async function PUT(request, { params }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { id } = params; // Gets the ID from the URL (e.g., /api/pickups/123)

  // Authorization Check: Ensure the user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const updateData = await request.json();

    // 1. Perform the update operation
    const { data: updatedPickup, error } = await supabase
      .from('pickup_schedule')
      .update(updateData) // Update with the status, schedule, or notes provided in the request body
      .eq('id', id)      // Target the specific pickup request ID
      .select()         // Return the updated row
      .single();

    if (error) {
      console.error('Pickup update error:', error.message);
      throw new Error(error.message);
    }

    // 2. Return the successfully updated data
    return new Response(JSON.stringify(updatedPickup), {
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

// NOTE: A DELETE request can also be added here to allow the admin to cancel/delete a request.