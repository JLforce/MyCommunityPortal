import HeaderButtons from '../../components/HeaderButtons';
import ProfileCard from '../../components/ProfileCard';

export default function ProfilePage(){
  return (
    <div>
      <header style={{background:'var(--green-50)',borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{display:'inline-flex',width:32,height:32,alignItems:'center',justifyContent:'center',borderRadius:8,background:'var(--green-900)',color:'#fff',fontWeight:700}}>MC</div>
            <div style={{fontWeight:700}}>MyCommunityPortal</div>
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
            <ProfileCard />
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
