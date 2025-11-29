import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import HeaderButtons from '../../components/HeaderButtons';
import ProfileCard from '../../components/ProfileCard';
import Brand from '../../components/Brand';

export default async function ProfilePage(){
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Get user profile from database
  let profile = null;
  let profileError = null;
  
  if (user) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    profile = data;
    profileError = error;
  }

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
        <h1 style={{marginBottom:6}}>Profile</h1>
        <p className="muted">View and edit your profile information. This page demonstrates a responsive layout that adapts to different screen sizes.</p>

        <div className="profile-grid" style={{marginTop:20}}>
          <section className="profile-main">
            <ProfileCard user={user} profile={profile} />
          </section>

          <aside className="profile-side">
            <div className="card" style={{marginBottom:12}}>
              <h4>Contact & Support</h4>
              <p className="small muted">If you need help updating your profile or account, contact support.</p>
              <div style={{marginTop:12}}>
                <a className="btn" href="/contact-support">Contact support</a>
                <a className="muted small" style={{display:'block',marginTop:8}} href="/help-center">Help center</a>
              </div>
            </div>

            <div className="card" style={{background:'var(--green-50)'}}>
              <h4>Privacy</h4>
              <p className="small muted">Manage what information is visible to other users in Settings.</p>
              <div style={{marginTop:12}}>
                <a className="btn btn-light" href="/settings">Profile privacy</a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
