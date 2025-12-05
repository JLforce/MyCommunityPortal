import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { getPickupsCount, getPendingReportsCount, getResolvedIssuesCount, getUsersCount, getRecentActivity } from '@/app/actions/data'

export default async function AdminDashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/signin');
  }
  const pickupsCountData = await getPickupsCount()
  const pendingReportsCountData = await getPendingReportsCount()
  const resolvedIssuesCountData = await getResolvedIssuesCount()
  const usersCountData = await getUsersCount()
  const recentActivityData = await getRecentActivity()

  const pickupsCount = pickupsCountData.count ?? 0
  const pendingReportsCount = pendingReportsCountData.count ?? 0
  const resolvedIssuesCount = resolvedIssuesCountData.count ?? 0
  const usersCount = usersCountData.count ?? 0
  const recentActivity = recentActivityData.data ?? []

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, marginBottom: 18 }}>
        <div className="card" style={{ padding: 22, borderRadius: 12, background: '#ffffff', boxShadow: '0 6px 18px rgba(16,24,40,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="metric-icon metric-icon--pickups">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="7" width="12" height="6" rx="1" fill="#166534" opacity="0.95" />
                <rect x="16" y="9" width="5" height="3" rx="0.6" fill="#166534" opacity="0.95" />
              </svg>
            </div>
            <div className="muted small" style={{ fontSize: 16, fontWeight: 700 }}>Total Pickups</div>
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, marginTop: 10 }}>{pickupsCount}</div>
        </div>

        <div className="card" style={{ padding: 22, borderRadius: 12, background: '#ffffff', boxShadow: '0 6px 18px rgba(16,24,40,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="metric-icon metric-icon--reports">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 3h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3z" fill="#c2410c" opacity="0.98" />
                <rect x="9" y="9" width="6" height="1.5" rx="0.6" fill="#fff" opacity="0.95" />
              </svg>
            </div>
            <div className="muted small" style={{ fontSize: 16, fontWeight: 700 }}>Pending Reports</div>
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, marginTop: 10 }}>{pendingReportsCount}</div>
        </div>

        <div className="card" style={{ padding: 22, borderRadius: 12, background: '#ffffff', boxShadow: '0 6px 18px rgba(16,24,40,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="metric-icon metric-icon--resolved">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8" fill="#ffffff" opacity="0.98" />
                <path d="M9 12.5l1.8 1.8L15 11" stroke="#115a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div className="muted small" style={{ fontSize: 16, fontWeight: 700 }}>Resolved Issues</div>
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, marginTop: 10 }}>{resolvedIssuesCount}</div>
        </div>

        <div className="card" style={{ padding: 22, borderRadius: 12, background: '#ffffff', boxShadow: '0 6px 18px rgba(16,24,40,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="metric-icon metric-icon--users">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="7.5" r="2.6" fill="#0f172a" opacity="0.98" />
                <path d="M4 19c1.5-4 7-4 8-4s6.5 0 8 4v1H4v-1z" fill="#0f172a" opacity="0.95" />
              </svg>
            </div>
            <div className="muted small" style={{ fontSize: 16, fontWeight: 700 }}>Active Users</div>
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, marginTop: 10 }}>{usersCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
        <div className="card" style={{ padding: 20, borderRadius: 12, background: '#ffffff', boxShadow: '0 6px 18px rgba(16,24,40,0.03)' }}>
          <h3 style={{ marginTop: 0, fontSize: 20, fontWeight: 800 }}>Recent Activity</h3>
          <div style={{ display: 'grid', gap: 0, marginTop: 14 }}>
            {recentActivity.map((activity, index) => (
              <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: index === recentActivity.length - 1 ? 'none' : '1px solid rgba(16,24,40,0.04)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{activity.title}</div>
                  <div className="small muted" style={{ fontSize: 13 }}>{activity.profiles?.full_name ?? 'Anonymous'}</div>
                </div>
                <div className="muted small" style={{ fontSize: 13 }}>{new Date(activity.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20, borderRadius: 12, background: '#ffffff', boxShadow: '0 6px 18px rgba(16,24,40,0.03)' }}>
          <h3 style={{ marginTop: 0, fontSize: 20, fontWeight: 800 }}>This Week</h3>
          <div style={{ marginTop: 12 }}>
            <div className="small muted" style={{ fontSize: 15 }}>Completion Rate <span style={{ float: 'right', fontSize: 14 }}>87%</span></div>
            <div style={{ height: 10, background: '#eef6ef', borderRadius: 6, overflow: 'hidden', margin: '8px 0' }}><div style={{ width: '87%', height: '100%', background: '#166534' }}></div></div>

            <div className="small muted" style={{ fontSize: 15 }}>Waste Collected <span style={{ float: 'right', fontSize: 14 }}>92%</span></div>
            <div style={{ height: 10, background: '#fff5ed', borderRadius: 6, overflow: 'hidden', margin: '8px 0' }}><div style={{ width: '92%', height: '100%', background: '#d97706' }}></div></div>

            <div className="small muted" style={{ fontSize: 15 }}>Recyclables Rate <span style={{ float: 'right', fontSize: 14 }}>65%</span></div>
            <div style={{ height: 10, background: '#eef4ff', borderRadius: 6, overflow: 'hidden', margin: '8px 0' }}><div style={{ width: '65%', height: '100%', background: '#1e40af' }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
