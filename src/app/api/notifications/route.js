// src/app/api/notifications/route.js
import { createServerClient } from '@/lib/supabase/server'; // Assumed utility for server-side Supabase connection
import { cookies } from 'next/headers';

// --- GET: Fetch all UNREAD notifications for the current admin ---
export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // 1. Get the current authenticated user's ID
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
  }

  // 2. Query the 'notifications' table
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)   // Filter by the current user's ID
    .eq('is_read', false)     // Only fetch UNREAD notifications
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error('Notification fetch error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // 3. Return the data to the frontend NotificationPanel
  return new Response(JSON.stringify(notifications), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// --- POST: Mark a list of notifications as READ ---
export async function POST(request) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const { ids } = await request.json(); // Expects an array of IDs to mark read

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Update the 'is_read' status
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .in('id', ids) // Update all IDs in the array
    .eq('user_id', user.id); // Security check

  if (error) {
    console.error('Mark read error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Notifications marked as read' }), { status: 200 });
}