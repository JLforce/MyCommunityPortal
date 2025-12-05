import Brand from '../../components/Brand';
import HeaderButtons from '../../components/HeaderButtons';
import AdminSidebar from '../../components/AdminSidebar';

export default function DashboardAdminLayout({ children }) {
  return (
    <div className="admin-dashboard-root">
      <header className="dashboard-header" style={{padding:'18px 0',background:'var(--green-50)',borderBottom:'1px solid rgba(16,185,129,0.06)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Brand />
            <div style={{marginLeft:12}}>
              <h2 className="dashboard-title" style={{margin:0}}>
                {/*<span className="title-main">City Official</span>
                <span className="title-tag"> (Admin)</span>*/}
              </h2>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <HeaderButtons />
          </div>
        </div>
      </header>

      <main className="page-fade-in dashboard-main">
        <div className="container dashboard-container">
          <AdminSidebar />

          <div className="dashboard-content">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
