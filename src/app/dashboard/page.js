"use client";
import Link from 'next/link';
import HeaderButtons from '../../components/HeaderButtons';
import LiveStatus from '../../components/LiveStatus';

const LeafIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2C12 2 7 7 7 11c0 4 3 7 5 9 2-2 5-5 5-9 0-4-5-9-5-9z" fill="#16a34a" />
    <path d="M12 2c0 0 2.5 1.8 3.8 3.3C18.4 7 19 8.5 19 11c0 2-1 4-3 6-1.3-1.2-3.5-3.5-4.2-5.1C9.8 10 10 7 12 2z" fill="#059669" opacity="0.9" />
  </svg>
);

const RecycleIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 12v1a8 8 0 01-8 8 8 8 0 01-8-8V11" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12l3-3 3 3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12l-3 3-3-3" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#2563eb" strokeWidth="1.4" />
    <path d="M16 3v4M8 3v4M3 11h18" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const WarningIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2L2 20h20L12 2z" fill="#FFEDD5" stroke="#fb923c" strokeWidth="1.2" />
    <path d="M12 9v4" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 17h.01" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CheckIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="#ECFDF5" stroke="#10b981" strokeWidth="1.2" />
    <path d="M8 12.5l1.8 1.8L16 9" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CogIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 015.28 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.4 6.6A2 2 0 017.23 3.77l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c.12.7.7 1.24 1.4 1.39h.24a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0120.72 6.1l-.06.06a1.65 1.65 0 00-.33 1.82v.24c.15.7.69 1.28 1.39 1.4H21a2 2 0 010 4h-.09c-.7.12-1.24.7-1.39 1.4v.24z" stroke="#374151" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AnimatedRobotIcon = ({width=18,height=18}) => (
  <svg className="robot-icon" width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {/* body */}
    <rect x="4" y="6" width="16" height="12" rx="3" fill="#F3F4F6" stroke="#374151" strokeWidth="0.9" />
    {/* screen */}
    <rect x="7.2" y="9" width="9.6" height="6" rx="1" fill="#fff" />
    {/* eye */}
    <circle className="robot-eye" cx="12" cy="12" r="1.4" fill="#2563eb" />
    {/* antenna line */}
    <line className="robot-antenna" x1="12" y1="6" x2="12" y2="3" stroke="#374151" strokeWidth="1.1" strokeLinecap="round" />
    <circle className="robot-antenna-tip" cx="12" cy="2.2" r="0.7" fill="#fb923c" />
  </svg>
);

const LogoutIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M16 17l5-5-5-5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h4" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Sidebar() {
  return (
    <aside className="sidebar" role="navigation" aria-label="Primary">
      <div className="sidebar-brand">
        <div className="brand-logo small" aria-hidden>
          <LeafIcon width={18} height={18} />
        </div>
        <strong>MyCommunityPortal</strong>
      </div>

      <nav>
        <Link href="/dashboard" className="nav-link active" aria-current="page">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="icon-box" aria-hidden>
              <LeafIcon width={16} height={16} />
            </span>
            <span>Dashboard</span>
          </div>
          <span className="home-badge">Home</span>
        </Link>

        <Link href="/pickup" className="nav-link">
          <span className="icon-box" aria-hidden>
            <RecycleIcon width={16} height={16} />
          </span>
          <span>Pickup</span>
        </Link>

        <Link href="/reports" className="nav-link">
          <span className="icon-box" aria-hidden>
            <WarningIcon width={16} height={16} />
          </span>
          <span>Reports</span>
        </Link>

        <Link href="/help-center" className="nav-link">
          <span className="icon-box" aria-hidden>
            <CheckIcon width={16} height={16} />
          </span>
          <span>Guide</span>
        </Link>

        <Link href="/analytics" className="nav-link">
          <span className="icon-box" aria-hidden>
            <CogIcon width={16} height={16} />
          </span>
          <span>Analytics</span>
        </Link>

        <Link href="/chatbot" className="nav-link">
          <span className="icon-box" aria-hidden>
            <UserIcon width={16} height={16} />
          </span>
          <span>Chatbot</span>
        </Link>
      </nav>
    </aside>
  );
}

function DashboardHeader(){
  return (
    <header className="dashboard-header">
      <div className="container">
        <div className="brand">
          <div className="brand-logo large" aria-hidden>
            <LeafIcon width={18} height={18} />
          </div>
          <div className="brand-text">MyCommunityPortal</div>
        </div>
        
        {/* Search removed per user request - keep brand left and actions right */}

        <div className="header-actions">
          <HeaderButtons />
        </div>
      </div>
    </header>
  );
}

function StatusPill({children, color='green'}){
  const bg = color === 'green' ? '#dff6e6' : color === 'orange' ? '#fff3e0' : '#eef2ff';
  const text = color === 'green' ? 'var(--green-800)' : color === 'orange' ? '#b45309' : '#3730a3';
  return <span style={{background:bg,color:text,padding:'6px 10px',borderRadius:999,fontWeight:700,fontSize:13}}>{children}</span>;
}

export default function DashboardPage(){
  return (
    <>
      <DashboardHeader />

      <main className="page-fade-in" style={{padding:'28px 0'}}>
        <div className="container" style={{display:'flex',gap:20,alignItems:'flex-start'}}>
          <Sidebar />

          <div style={{flex:1}}>
            <div style={{marginBottom:18}}>
              <div>
                <h1 style={{margin:'0 0 6px'}}>Welcome back, John!</h1>
                <p className="muted" style={{margin:0}}>Here's what's happening in your community today.</p>
              </div>

              <div style={{display:'flex',gap:12,marginTop:12,flexWrap:'nowrap',overflowX:'auto',WebkitOverflowScrolling:'touch',paddingBottom:6}}>
                <Link href="/pickup" className="cta-pill blue">
                  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:8,background:'rgba(37,99,235,0.08)',color:'#2563eb'}} aria-hidden>
                    <CalendarIcon width={16} height={16} />
                  </span>
                  <span>Schedule Pickup</span>
                </Link>

                <Link href="/reports" className="cta-pill orange">
                  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:8,background:'rgba(251,146,60,0.08)',color:'#fb923c'}} aria-hidden>
                    <WarningIcon width={16} height={16} />
                  </span>
                  <span>Report Issue</span>
                </Link>

                <Link href="/help-center" className="cta-pill green">
                  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:8,background:'rgba(16,185,129,0.06)',color:'var(--green-700)'}} aria-hidden>
                    <CheckIcon width={16} height={16} />
                  </span>
                  <span>Waste Guide</span>
                </Link>

                <Link href="/chatbot" className="cta-pill indigo">
                  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:8,background:'rgba(55,65,81,0.06)',color:'var(--text-700)'}} aria-hidden>
                    <AnimatedRobotIcon width={16} height={16} />
                  </span>
                  <span>AI Assistant</span>
                </Link>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginTop:16}}>
              <div className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div aria-hidden style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:8,background:'rgba(16,185,129,0.12)'}}>
                      <RecycleIcon width={16} height={16} />
                    </div>
                    <h3 style={{margin:0}}>Upcoming Pickups</h3>
                  </div>
                  <Link href="/pickup" className="cta-pill small">+ Schedule</Link>
                </div>
                <p className="muted">Your scheduled waste collection dates</p>

                <div style={{marginTop:12}}>
                  <div style={{padding:48, textAlign:'center', borderRadius:12, background:'#F9FAFB', border:'1px dashed #E5E7EB'}}>
                    <div style={{marginBottom:16, display:'flex', justifyContent:'center'}}>
                      <div style={{width:64, height:64, borderRadius:50, background:'#ECFDF5', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <RecycleIcon width={32} height={32} />
                      </div>
                    </div>
                    <h3 style={{margin:'0 0 8px', fontSize:18, color:'var(--text-900)', fontWeight:700}}>No Scheduled Pickups Yet</h3>
                    <p className="muted" style={{margin:0, fontSize:14, maxWidth:400, marginLeft:'auto', marginRight:'auto'}}>
                      No scheduled pickups yet — user's scheduled pickups will appear here.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div aria-hidden style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:8,background:'rgba(251,146,60,0.08)'}}>
                      <WarningIcon width={16} height={16} />
                    </div>
                    <h3 style={{margin:0}}>Recent Reports</h3>
                  </div>
                  <Link href="/reports" className="cta-pill small">+ Report</Link>
                </div>
                <p className="muted">Issues you've reported to the community</p>

                <div style={{marginTop:12}}>
                  <div style={{padding:48, textAlign:'center', borderRadius:12, background:'#F9FAFB', border:'1px dashed #E5E7EB'}}>
                    <div style={{marginBottom:16, display:'flex', justifyContent:'center'}}>
                      <div style={{width:64, height:64, borderRadius:50, background:'#FFF7ED', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <WarningIcon width={32} height={32} />
                      </div>
                    </div>
                    <h3 style={{margin:'0 0 8px', fontSize:18, color:'var(--text-900)', fontWeight:700}}>No Reports Yet</h3>
                    <p className="muted" style={{margin:0, fontSize:14, maxWidth:400, marginLeft:'auto', marginRight:'auto'}}>
                      No reports yet — user-submitted reports will appear here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer area spacing */}
            <div style={{height:36}} />
          </div>
        </div>
      </main>

      {/* Dashboard-specific footer (improved) */}
      <footer className="dashboard-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="col">
              <h4>About MyCommunityPortal</h4>
              <p className="muted" style={{marginTop:6}}>A simple way to manage community services — pickups, reports, and assistance all in one place.</p>
              <div className="socials" aria-hidden>
                <a href="#" title="Twitter" aria-label="Twitter" style={{color:'var(--green-900)'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6.2c-.5.2-1 .3-1.6.4.6-.4 1-1 1.3-1.8-.6.4-1.4.7-2.2.9C16.7 5 15.7 4.5 14.5 4.5c-1.8 0-3.2 1.5-3.2 3.3 0 .3 0 .6.1.8C8.1 8.5 5.4 7 3.7 4.6c-.3.6-.5 1.1-.5 1.8 0 1.2.6 2.2 1.6 2.8-.5 0-1-.2-1.4-.4v.1c0 1.8 1.3 3.3 3 3.6-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.7 2.4 3.3 2.4C7.3 17.9 5.1 18.7 2.7 18.7c-.4 0-.8 0-1.2-.1 1.7 1.1 3.8 1.8 6 1.8 7.2 0 11.2-6 11.2-11.2v-.5c.8-.6 1.4-1.4 1.9-2.3-.8.4-1.6.7-2.5.9z" fill="#10B981"/></svg>
                </a>
                <a href="#" title="Facebook" aria-label="Facebook" style={{color:'var(--green-900)'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.1C22 6.6 17.5 2 12 2S2 6.6 2 12.1c0 5 3.7 9.1 8.5 9.9v-7H8.2v-3h2.3V9.1c0-2.3 1.4-3.6 3.4-3.6.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.3v1.6h2.2l-.4 3h-1.8v7C18.3 21.2 22 17.2 22 12.1z" fill="#16A34A"/></svg>
                </a>
              </div>
            </div>

            <div className="col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/pickup" className="glow-link">Schedule Pickup</Link></li>
                <li><Link href="/reports" className="glow-link">Report Issue</Link></li>
                <li><Link href="/help-center" className="glow-link">Waste Guide</Link></li>
                <li><Link href="/chatbot" className="glow-link">AI Assistant</Link></li>
              </ul>
            </div>

            <div className="col">
              <h4>Contact</h4>
              <p className="muted" style={{marginTop:6}}>Phone: <strong>(555) 123-4567</strong><br/>Email: <Link href="mailto:support@mycommunityportal.com" className="glow-link">support@mycommunityportal.com</Link></p>
            </div>

            <div className="col">
              <h4>System Status</h4>
              <div style={{marginTop:6, display:'flex', alignItems:'center', gap:8}}>
                <span className="status-dot pulse" aria-hidden />
                <LiveStatus />
              </div>
            </div>
          </div>

          <div className="bottom-row">
            <div className="muted">© {new Date().getFullYear()} MyCommunityPortal — All rights reserved.</div>
            <div className="muted">Built with care · <Link href="/help-center">Help Center</Link></div>
          </div>
        </div>
      </footer>
    </>
  );
}
