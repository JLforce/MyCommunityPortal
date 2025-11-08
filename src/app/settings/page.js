import HeaderButtons from '../../components/HeaderButtons';

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
        <h1>Settings</h1>
        <p className="muted">Manage your account settings and preferences. The header controls remain responsive on all screen sizes.</p>

        <div style={{marginTop:18,display:'grid',gap:12}}>
          <div className="card">
            <h4>Account</h4>
            <p className="small muted">Change your display name, email, and notification preferences.</p>
          </div>

          <div className="card">
            <h4>Notifications</h4>
            <p className="small muted">Choose which notifications you want to receive.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
