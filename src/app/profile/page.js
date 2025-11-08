import HeaderButtons from '../../components/HeaderButtons';

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
        <h1>Profile</h1>
        <p className="muted">View and edit your profile information. This page demonstrates a responsive layout that adapts to different screen sizes.</p>

        <div style={{marginTop:18,display:'grid',gap:12}}>
          <div className="card" style={{display:'flex',gap:12,alignItems:'center'}}>
            <div style={{width:72,height:72,borderRadius:12,background:'#f3f4f6'}} aria-hidden></div>
            <div>
              <strong>John Doe</strong>
              <div className="small muted">johndoe@example.com</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
