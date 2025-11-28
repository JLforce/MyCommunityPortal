import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import PickupClient from './PickupClient';

export default async function PickupPage(){
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  return <PickupClient user={user} />;
}
