import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';

// Load the heavy, browser-only reports UI on the client only (no SSR)
const ReportsClient = dynamic(() => import('./ReportsClient'), {
  ssr: false,
});

export default async function ReportsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get the authenticated user on the server and pass basic info to the client
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  console.log('=== Reports Page (Server): User Fetched ===');
  console.log('User:', user);
  console.log('User ID:', user?.id);
  console.log('User Email:', user?.email);
  console.log('Auth Error:', authError?.message);
  console.log('===========================================');

  // Render a client-only shell for the reports UI; server just passes props
  return <ReportsClient user={user || null} />;
}
