import { cookies } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';
import PickupsAdminClient from './PickupsAdminClient';

export default async function PickupsAdminPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  return <PickupsAdminClient user={user} />;
}

