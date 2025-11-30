import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import ReportsAdminClient from './ReportsAdminClient';

export default async function ReportsAdminPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  return <ReportsAdminClient user={user} />;
}

