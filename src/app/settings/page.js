import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import HeaderButtons from '../../components/HeaderButtons';
import SettingsForm from '../../components/SettingsForm';
import Brand from '../../components/Brand';

export default async function SettingsPage(){
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let settings = null;

  if (user) {
    // Fetch profile and settings in parallel for better performance
    const [profileRes, settingsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_settings').select('*').eq('user_id', user.id).single()
    ]);

    if (profileRes.data) {
      profile = profileRes.data;
    }

    if (settingsRes.data) {
      settings = settingsRes.data;
    }
  }

  // Combine data into a single object to pass to the form
  const initialSettings = { ...profile, ...settings, email: user?.email };

  return (
    <div>
      <header style={{background:'var(--green-50)',borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Brand userRole={profile?.role} />
          </div>

          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <HeaderButtons />
          </div>
        </div>
      </header>

      <main className="container" style={{padding:'28px 0'}}>
        <h1 style={{marginBottom:6}}>Settings</h1>
        <p className="muted">Manage your account, privacy, and preferences. Changes apply to your profile across MyCommunityPortal.</p>

        <div className="settings-grid" style={{marginTop:20}}>
          <section className="settings-main">
            <SettingsForm initialSettings={initialSettings} />
          </section>

          <aside className="settings-side">
            <div className="card" style={{marginBottom:12}}>
              <h4>Quick actions</h4>
              <p className="small muted">Useful account utilities.</p>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:12}}>
                <button className="btn">Download account data</button>
                <button className="btn btn-light">Manage connected apps</button>
                <a className="muted small" href="/help-center">Learn about privacy</a>
              </div>
            </div>

            <div className="card" style={{background:'var(--green-50)'}}>
              <h4>Support</h4>
              <p className="small muted">Need help? Contact our support team for account issues.</p>
              <div style={{marginTop:12}}>
                <a className="btn" href="/contact-support">Contact support</a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
