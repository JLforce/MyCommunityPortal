import HeaderButtons from '../../components/HeaderButtons';
import Brand from '../../components/Brand';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

function formatTimestamp(value) {
  if (!value) return 'Just now';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Just now';
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch {
    return 'Just now';
  }
}

async function getResidentNotifications() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?next=/notifications');
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('id,title,message,body,description,created_at,is_read,type,user_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Resident notifications fetch error:', error.message);
    return [];
  }

  return data ?? [];
}

export default async function NotificationsPage(){
  const notifications = await getResidentNotifications();

  return (
    <div>
      <header style={{background:'var(--green-50)',borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Brand />
          </div>

          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <HeaderButtons />
          </div>
        </div>
      </header>

      <main className="container" style={{padding:'28px 0'}}>
        <h1>Notifications</h1>
        <p className="muted">All your notifications will appear here. Here you will see reminders, report updates, and pickup status pulled directly from your account.</p>

        <div style={{marginTop:22,display:'flex',flexDirection:'column',gap:12}}>
          {notifications.length === 0 ? (
            <div className="card" style={{textAlign:'center',padding:'32px 16px'}}>
              <strong>No notifications yet</strong>
              <p className="muted" style={{marginTop:8}}>When new activity happens, it will show up here automatically.</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const title = notification.title || notification.description || 'Notification';
              const body = notification.message || notification.body || notification.description || 'No additional details provided.';
              const timestamp = formatTimestamp(notification.created_at);
              const unread = notification.is_read === false;

              return (
                <div key={notification.id} className="card" style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'flex-start',borderLeft: unread ? '4px solid var(--green-500)' : '4px solid transparent'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <strong>{title}</strong>
                      {unread && (
                        <span style={{fontSize:11,padding:'2px 6px',borderRadius:999,background:'var(--green-50)',color:'var(--green-700)'}}>New</span>
                      )}
                    </div>
                    <p className="muted small" style={{marginTop:6}}>{body}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="small muted">{timestamp}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
