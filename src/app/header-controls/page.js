import HeaderButtons from '../../components/HeaderButtons';
import Link from 'next/link';

export default function HeaderControlsDemo(){
  return (
    <div>
      <header style={{background:'var(--green-50)',borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{display:'inline-flex',width:32,height:32,alignItems:'center',justifyContent:'center',borderRadius:8,background:'var(--green-900)',color:'#fff',fontWeight:700}}>
              {/* small logo placeholder */}
              <span style={{width:14,height:14,background:'#10b981',borderRadius:4,display:'inline-block'}} aria-hidden></span>
            </div>
            <div style={{fontWeight:700}}>MyCommunityPortal</div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <HeaderButtons />
          </div>
        </div>
      </header>

      <main className="container" style={{padding:'36px 0'}}>
        <h1>Header Buttons — demo</h1>
        <p className="muted">This page demonstrates the responsive header actions component. Resize the browser to see the buttons collapse into a single menu button on smaller screens.</p>

        <div style={{marginTop:24}}>
          <h3>Quick links</h3>
          <p className="small">Try the actions — Notifications, Settings, Profile, and Logout.</p>
          <p className="small">The menu items link to example routes: <Link href="/notifications">/notifications</Link>, <Link href="/settings">/settings</Link>, <Link href="/profile">/profile</Link>.</p>
        </div>
      </main>
    </div>
  );
}
