import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import ReportsAdminClient from './ReportsAdminClient';

export const metadata = {
  title: 'Reports - Dashboard Admin'
};

export default async function ReportsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  return (
    <main>
      {/* Pass the user object to the client component which will handle all data fetching and logic */}
      <ReportsAdminClient user={user} />
    </main>
  );
}
