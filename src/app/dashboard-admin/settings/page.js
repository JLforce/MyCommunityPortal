import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import SettingsPanel from '../../../components/SettingsPanel';

export const metadata = {
  title: 'Settings - Dashboard Admin'
};

export default async function SettingsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main>
        <SettingsPanel />
      </main>
    );
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, phone, municipality')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile for settings:', profileError);
  }

  const { data: settingsData, error: settingsError } = await supabase
    .from('admin_settings')
    .select('id, site_name, contact_email, pickup_enable')
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    console.error('Error fetching admin settings:', settingsError);
  }

  const initialGeneral = {
    barangayName: settingsData?.site_name || profileData?.municipality || 'Barangay',
    contactEmail: settingsData?.contact_email || profileData?.email || '',
    contactPhone: profileData?.phone || '',
  };

  const initialNotifications = {
    email: true,
    sms: true,
    push: false,
    weeklyReports: true,
  };

  const initialPickup = {
    defaultTime: 'Morning (6 AM - 12 PM)',
    maxPerDay: 50,
    enable: settingsData?.pickup_enable ?? true,
  };

  return (
    <main>
      <SettingsPanel
        settingsId={settingsData?.id}
        initialGeneral={initialGeneral}
        initialNotifications={initialNotifications}
        initialPickup={initialPickup}
      />
    </main>
  );
}
