import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import ReportsClient from './ReportsClient';

export default async function ReportsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  console.log('=== Reports Page (Server): User Fetched ===');
  console.log('User:', user);
  console.log('User ID:', user?.id);
  console.log('User Email:', user?.email);
  console.log('Auth Error:', authError?.message);
  console.log('===========================================');

  return <ReportsClient user={user} />;
}
