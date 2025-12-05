import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import NotificationPanel from '../../../components/NotificationPanel';

export const metadata = {
  title: 'Notifications - Dashboard Admin'
};

export default async function NotificationPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <NotificationPanel initialNotifications={[]} />;
  }

  // Fetch admin municipality
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('municipality')
    .eq('id', user.id)
    .maybeSingle();

  const adminMunicipality = adminProfile?.municipality || null;

  // Fetch recent notifications
  const { data: notificationsData, error: notificationsError } = await supabase
    .from('notifications')
    .select('id, type, message, is_read, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(50);

  if (notificationsError) {
    console.error('Error fetching notifications:', notificationsError);
  }

  const notifications = notificationsData || [];

  // Fetch related profiles to filter by municipality and enrich display
  const userIds = Array.from(new Set(notifications.map(n => n.user_id).filter(Boolean)));
  let profilesMap = new Map();

  if (userIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, municipality')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching notification profiles:', profilesError);
    } else {
      profilesMap = new Map(profilesData.map(p => [p.id, p]));
    }
  }

  const scopedNotifications = notifications
    .filter(n => {
      if (!adminMunicipality) return true;
      const prof = profilesMap.get(n.user_id);
      return prof?.municipality === adminMunicipality;
    })
    .map(n => {
      const prof = profilesMap.get(n.user_id);
      const name = prof ? `${prof.first_name || ''} ${prof.last_name || ''}`.trim() || 'Resident' : 'Resident';
      return {
        ...n,
        residentName: name,
      };
    });

  return <NotificationPanel initialNotifications={scopedNotifications} />;
}
