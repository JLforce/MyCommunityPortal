import HeaderButtons from '../../components/HeaderButtons';
import SettingsForm from '../../components/SettingsForm';

export default function SettingsPage(){
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
        <h1 style={{marginBottom:6}}>Settings</h1>
        <p className="muted">Manage your account, privacy, and preferences. Changes apply to your profile across MyCommunityPortal.</p>

        <div className="settings-grid" style={{marginTop:20}}>
          <section className="settings-main">
            <SettingsForm />
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
