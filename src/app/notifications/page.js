import HeaderButtons from '../../components/HeaderButtons';
import Link from 'next/link';

export default function NotificationsPage(){
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
        <h1>Notifications</h1>
        <p className="muted">All your notifications will appear here. This page is responsive — resize the window to see header actions collapse into the mobile menu.</p>

        <div style={{marginTop:18,display:'grid',gap:12}}>
          <div className="card">
            <strong>Pickup Reminder</strong>
            <div className="small muted">Tomorrow at 8:00 AM</div>
          </div>

          <div className="card">
            <strong>Report Update</strong>
            <div className="small muted">Your report about Oak Street was updated.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
