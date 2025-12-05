import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import UsersPanel from '../../../components/UsersPanel';

export const metadata = {
  title: 'Users - Dashboard Admin'
};

export default async function UsersPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main>
        <UsersPanel initialUsers={[]} />
      </main>
    );
  }

  // Get admin municipality
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('municipality')
    .eq('id', user.id)
    .maybeSingle();

  const adminMunicipality = adminProfile?.municipality || null;

  // Fetch users scoped to admin municipality (or all if municipality missing)
  let usersQuery = supabase
    .from('profiles')
    .select('id, first_name, last_name, email, role, municipality, phone, barangay, street_address')
    .eq('role', 'resident')
    .order('last_name', { ascending: true });

  if (adminMunicipality) {
    usersQuery = usersQuery.eq('municipality', adminMunicipality);
  }

  const { data: usersData, error: usersError } = await usersQuery;

  if (usersError) {
    console.error('Error fetching users:', usersError);
  }

  const initialUsers = usersData || [];

  return (
    <main>
      <UsersPanel initialUsers={initialUsers} />
    </main>
  );
}
