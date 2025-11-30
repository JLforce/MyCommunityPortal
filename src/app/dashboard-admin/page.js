import Brand from '../../components/Brand';
import HeaderButtons from '../../components/HeaderButtons';

export default function AdminDashboardPage(){
  return (
    <div className="admin-dashboard-root">
      <header className="dashboard-header" style={{padding:'18px 0',background:'var(--green-50)',borderBottom:'1px solid rgba(16,185,129,0.06)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Brand />
            <div style={{marginLeft:12}}>
              <h2 className="dashboard-title" style={{margin:0}}>
                <span className="title-main">City Authority</span>
                <span className="title-tag"> (Admin)</span>
              </h2>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <HeaderButtons />
          </div>
        </div>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:32,alignItems:'start',marginTop:20}} className="container" >
        <aside style={{width:300,background:'var(--green-50)',padding:'28px 22px',borderRadius:12,border:'1px solid rgba(16,185,129,0.04)',minHeight:720}}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <a href="/dashboard-admin" className="nav-link active" style={{display:'flex',alignItems:'center',gap:12,padding:'14px 20px',borderRadius:10,background:'var(--green-900)',color:'#fff',fontSize:18,fontWeight:800}}>
              <div className="nav-icon nav-icon--dashboard">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="#ffffff" />
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="#ffffff" />
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="#ffffff" />
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="#ffffff" />
                </svg>
              </div>
              <span>Dashboard</span>
            </a>

            <a href="/dashboard-admin/analytics" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--analytics">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="10" width="3" height="8" rx="1" fill="#065f46" />
                  <rect x="9" y="6" width="3" height="12" rx="1" fill="#065f46" />
                  <rect x="15" y="3" width="3" height="15" rx="1" fill="#065f46" />
                </svg>
              </div>
              Analytics
            </a>

            <a href="/reports" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--reports">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3z" fill="#c2410c" />
                  <rect x="9" y="8" width="6" height="1.6" rx="0.8" fill="#fff" opacity="0.9" />
                </svg>
              </div>
              Reports
            </a>

            <a href="/pickup" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--pickup">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="8" width="12" height="6" rx="1" fill="#1e3a8a" />
                  <rect x="15" y="9" width="5" height="3" rx="0.8" fill="#1e3a8a" />
                  <circle cx="8" cy="17" r="1.4" fill="#fff" />
                  <circle cx="18" cy="17" r="1.4" fill="#fff" />
                </svg>
              </div>
              Pickups
            </a>

            <a href="/users" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--users">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="3" fill="#0f172a" />
                  <path d="M4 19c1.5-4 7-4 8-4s6.5 0 8 4v1H4v-1z" fill="#0f172a" />
                </svg>
              </div>
              Users
            </a>

            
          </div>
        </aside>

        <main>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,marginBottom:18}}>
            <div className="card" style={{padding:22,borderRadius:12,background:'#ffffff',boxShadow:'0 6px 18px rgba(16,24,40,0.03)'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div className="metric-icon metric-icon--pickups">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="2" y="7" width="12" height="6" rx="1" fill="#166534" opacity="0.95" />
                          <rect x="16" y="9" width="5" height="3" rx="0.6" fill="#166534" opacity="0.95" />
                    </svg>
                  </div>
                  <div className="muted small" style={{fontSize:16,fontWeight:700}}>Total Pickups</div>
                </div>
                <div style={{fontSize:52,fontWeight:900,marginTop:10}}>1,248</div>
                <div className="small" style={{color:'var(--green-800)',marginTop:8,fontSize:15}}>+12.5% from last month</div>
            </div>
            <div className="card" style={{padding:22,borderRadius:12,background:'#ffffff',boxShadow:'0 6px 18px rgba(16,24,40,0.03)'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div className="metric-icon metric-icon--reports">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 3h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3z" fill="#c2410c" opacity="0.98" />
                      <rect x="9" y="9" width="6" height="1.5" rx="0.6" fill="#fff" opacity="0.95" />
                    </svg>
                  </div>
                  <div className="muted small" style={{fontSize:16,fontWeight:700}}>Pending Reports</div>
                </div>
                <div style={{fontSize:52,fontWeight:900,marginTop:10}}>45</div>
                <div className="small" style={{color:'#059669',marginTop:8,fontSize:15}}>-8.2% from last month</div>
            </div>
            <div className="card" style={{padding:22,borderRadius:12,background:'#ffffff',boxShadow:'0 6px 18px rgba(16,24,40,0.03)'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div className="metric-icon metric-icon--resolved">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="8" fill="#ffffff" opacity="0.98" />
                      <path d="M9 12.5l1.8 1.8L15 11" stroke="#115a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <div className="muted small" style={{fontSize:16,fontWeight:700}}>Resolved Issues</div>
                </div>
                <div style={{fontSize:52,fontWeight:900,marginTop:10}}>892</div>
                <div className="small" style={{color:'var(--green-800)',marginTop:8,fontSize:15}}>+23.1% from last month</div>
            </div>
            <div className="card" style={{padding:22,borderRadius:12,background:'#ffffff',boxShadow:'0 6px 18px rgba(16,24,40,0.03)'}}>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <div className="metric-icon metric-icon--users">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="7.5" r="2.6" fill="#0f172a" opacity="0.98" />
                      <path d="M4 19c1.5-4 7-4 8-4s6.5 0 8 4v1H4v-1z" fill="#0f172a" opacity="0.95" />
                    </svg>
                  </div>
                  <div className="muted small" style={{fontSize:16,fontWeight:700}}>Active Users</div>
                </div>
                <div style={{fontSize:52,fontWeight:900,marginTop:10}}>3,421</div>
                <div className="small" style={{color:'var(--green-800)',marginTop:8,fontSize:15}}>+5.4% from last month</div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:18}}>
            <div className="card" style={{padding:20,borderRadius:12,background:'#ffffff',boxShadow:'0 6px 18px rgba(16,24,40,0.03)'}}>
                <h3 style={{marginTop:0,fontSize:20,fontWeight:800}}>Recent Activity</h3>
                <div style={{display:'grid',gap:0,marginTop:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid rgba(16,24,40,0.04)'}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:16}}>Illegal dumping reported</div>
                      <div className="small muted" style={{fontSize:13}}>Barangay A</div>
                    </div>
                    <div className="muted small" style={{fontSize:13}}>2 hours ago</div>
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid rgba(16,24,40,0.04)'}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:16}}>Special pickup scheduled</div>
                      <div className="small muted" style={{fontSize:13}}>Barangay B</div>
                    </div>
                    <div className="muted small" style={{fontSize:13}}>1 hour ago</div>
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0'}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:16}}>Issue resolved</div>
                      <div className="small muted" style={{fontSize:13}}>Barangay C</div>
                    </div>
                    <div className="muted small" style={{fontSize:13}}>30 minutes ago</div>
                  </div>
                </div>
              </div>

            <div className="card" style={{padding:20,borderRadius:12,background:'#ffffff',boxShadow:'0 6px 18px rgba(16,24,40,0.03)'}}>
              <h3 style={{marginTop:0,fontSize:20,fontWeight:800}}>This Week</h3>
              <div style={{marginTop:12}}>
                <div className="small muted" style={{fontSize:15}}>Completion Rate <span style={{float:'right',fontSize:14}}>87%</span></div>
                <div style={{height:10,background:'#eef6ef',borderRadius:6,overflow:'hidden',margin:'8px 0'}}><div style={{width:'87%',height:'100%',background:'#166534'}}></div></div>

                <div className="small muted" style={{fontSize:15}}>Waste Collected <span style={{float:'right',fontSize:14}}>92%</span></div>
                <div style={{height:10,background:'#fff5ed',borderRadius:6,overflow:'hidden',margin:'8px 0'}}><div style={{width:'92%',height:'100%',background:'#d97706'}}></div></div>

                <div className="small muted" style={{fontSize:15}}>Recyclables Rate <span style={{float:'right',fontSize:14}}>65%</span></div>
                <div style={{height:10,background:'#eef4ff',borderRadius:6,overflow:'hidden',margin:'8px 0'}}><div style={{width:'65%',height:'100%',background:'#1e40af'}}></div></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
