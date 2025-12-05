import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import ProfilePanel from '../../../components/ProfilePanel';

export const metadata = {
  title: 'Profile - Dashboard Admin'
};

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main>
        <ProfilePanel initialProfile={{}} />
      </main>
    );
  }

  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, phone, role, municipality, barangay, street_address')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
  }

  const initialProfile = profileData || {};

  return (
    <main>
      <ProfilePanel userId={user.id} initialProfile={initialProfile} />
    </main>
  );
}
