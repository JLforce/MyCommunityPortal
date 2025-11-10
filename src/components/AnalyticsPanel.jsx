"use client";
import React from 'react';

// Provide mock analytics data so other modules (page) can export reports
export function getAnalyticsMockData(){
  const metrics = {
    totalCollections: 1247,
    totalCollectionsDelta: 12, // percent
    recyclingRate: 68, // percent
    recyclingDelta: 5,
    activeReports: 23,
    reportsDelta: -8,
    communityScore: 8.4,
    scoreDelta: 0.3,
  };

  const wasteComposition = [
    {label:'Recyclables', value:42, color:'var(--green-600)'},
    {label:'Organic', value:28, color:'#F59E0B'},
    {label:'General', value:25, color:'#6B7280'},
    {label:'Hazardous', value:5, color:'#EF4444'},
  ];

  const collectionEfficiency = [
    {label:'On-time Collections', value:'94%'},
    {label:'Route Efficiency', value:'87%'},
    {label:'Fuel Savings', value:'12%'},
    {label:'Customer Satisfaction', value:'4.6/5'},
  ];

  const issueStats = [
    {label:'Resolved', value:156, color:'#10B981'},
    {label:'In Progress', value:23, color:'#60A5FA'},
    {label:'Pending', value:8, color:'#F59E0B'},
  ];

  const environmental = {
    co2Saved:'2.4 tons',
    materialsRecycled:'847 kg',
    wasteReduction:'15%'
  };

  return { metrics, wasteComposition, collectionEfficiency, issueStats, environmental };
}

// Lightweight, presentational analytics panel with mock data and responsive layout.
export default function AnalyticsPanel(){
  const { metrics, wasteComposition, collectionEfficiency, issueStats, environmental } = getAnalyticsMockData();

  return (
    <div className="analytics-root">
      {/* Top metrics */}
      <div className="analytics-metrics" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
        <div className="metric-card fade-in stagger-child" style={{animationDelay:'0ms'}}>
          <div className="metric-title">Total Collections</div>
          <div className="metric-value">{metrics.totalCollections.toLocaleString()}</div>
          <div className="metric-sub">+{metrics.totalCollectionsDelta}% from last month</div>
        </div>

        <div className="metric-card fade-in stagger-child" style={{animationDelay:'80ms'}}>
          <div className="metric-title">Recycling Rate</div>
          <div className="metric-value">{metrics.recyclingRate}%</div>
          <div className="metric-sub">+{metrics.recyclingDelta}% from last month</div>
        </div>

        <div className="metric-card fade-in stagger-child" style={{animationDelay:'160ms'}}>
          <div className="metric-title">Active Reports</div>
          <div className="metric-value">{metrics.activeReports}</div>
          <div className="metric-sub" style={{color:metrics.reportsDelta<0? '#EF4444':'#10B981'}}>{metrics.reportsDelta}% from last month</div>
        </div>

        <div className="metric-card fade-in stagger-child" style={{animationDelay:'240ms'}}>
          <div className="metric-title">Community Score</div>
          <div className="metric-value">{metrics.communityScore}</div>
          <div className="metric-sub">+{metrics.scoreDelta} from last month</div>
        </div>
      </div>

      {/* Recent activity (added per design) */}
      <div className="card recent-activity-card" aria-labelledby="recent-activity-heading" style={{marginTop:8}}>
        <h3 id="recent-activity-heading" style={{margin:0,color:'var(--green-900)'}}>Recent Activity</h3>
        <p className="muted small" style={{marginTop:6}}>Latest system events and updates</p>

        <div style={{marginTop:12,display:'grid',gap:12}}>
          <article className="activity-row" role="article" aria-label="Route optimization completed">
            <div className="activity-icon" aria-hidden style={{background:'rgba(16,185,129,0.12)',borderRadius:8,display:'inline-flex',alignItems:'center',justifyContent:'center',width:44,height:44,color:'var(--green-800)'}}>✓</div>
            <div style={{flex:1,display:'flex',flexDirection:'column'}}>
              <div style={{fontWeight:700,color:'var(--text-700)'}}>Route optimization completed</div>
              <div className="muted small">2 hours ago • 12% efficiency improvement</div>
            </div>
          </article>

          <article className="activity-row" role="article" aria-label="Special collection scheduled">
            <div className="activity-icon" aria-hidden style={{background:'rgba(99,102,241,0.08)',borderRadius:8,display:'inline-flex',alignItems:'center',justifyContent:'center',width:44,height:44,color:'#4F46E5'}}>🚚</div>
            <div style={{flex:1,display:'flex',flexDirection:'column'}}>
              <div style={{fontWeight:700,color:'var(--text-700)'}}>Special collection scheduled</div>
              <div className="muted small">4 hours ago • Oak Street bulk items</div>
            </div>
          </article>

          <article className="activity-row" role="article" aria-label="Issue report resolved">
            <div className="activity-icon" aria-hidden style={{background:'rgba(253,224,71,0.09)',borderRadius:8,display:'inline-flex',alignItems:'center',justifyContent:'center',width:44,height:44,color:'#F59E0B'}}>⚠️</div>
            <div style={{flex:1,display:'flex',flexDirection:'column'}}>
              <div style={{fontWeight:700,color:'var(--text-700)'}}>Issue report resolved</div>
              <div className="muted small">6 hours ago • Illegal dumping on Main Ave</div>
            </div>
          </article>
        </div>
      </div>

      {/* Main charts area */}
      <div className="analytics-main">
  <div className="chart-card chart-large slide-up stagger-child" style={{animationDelay:'120ms'}}>
          <h4 className="card-heading">Collection Trends</h4>
          <p className="small muted">Weekly waste collection volumes</p>
          <div className="chart-placeholder" role="img" aria-label="Collection trends chart placeholder">
            <svg width="140" height="90" viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="0" y="0" width="140" height="90" fill="transparent"/>
              <g fill="none" stroke="var(--green-700)" strokeWidth="3" strokeLinecap="round">
                <path d="M8 70 L30 50 L55 60 L80 35 L105 45 L130 25" strokeOpacity="0.15" />
              </g>
            </svg>
            <div className="chart-note muted">Collection trends chart would appear here</div>
          </div>
        </div>

  <div className="chart-card slide-up stagger-child" style={{animationDelay:'200ms'}}>
          <h4 className="card-heading">Waste Composition</h4>
          <p className="small muted">Breakdown by waste type</p>
          <ul className="composition-list">
            {wasteComposition.map((w)=> (
              <li key={w.label} className="composition-row">
                <span style={{display:'flex',alignItems:'center',gap:10}}>
                  <span className="swatch" style={{background:w.color}} aria-hidden></span>
                  <span style={{color:'var(--text-700)'}}>{w.label}</span>
                </span>
                <span style={{fontWeight:700}}>{w.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lower summary grid */}
      <div className="analytics-summary">
  <div className="card stat-card fade-in stagger-child" style={{animationDelay:'240ms'}}>
          <h4 className="card-heading">Collection Efficiency</h4>
          <p className="small muted">Route optimization and timing</p>
          <ul style={{marginTop:12,listStyle:'none',padding:0}}>
            {collectionEfficiency.map(i => (
              <li key={i.label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}>
                <span className="muted">{i.label}</span>
                <strong style={{color:'var(--green-800)'}}>{i.value}</strong>
              </li>
            ))}
          </ul>
        </div>

  <div className="card stat-card fade-in stagger-child" style={{animationDelay:'320ms'}}>
          <h4 className="card-heading">Issue Resolution</h4>
          <p className="small muted">Community report handling</p>
          <div style={{marginTop:12,display:'grid',gap:8}}>
            {issueStats.map(s => (
              <div key={s.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{width:10,height:10,borderRadius:4,background:s.color,display:'inline-block'}} aria-hidden></span>
                  <div className="muted">{s.label}</div>
                </div>
                <div style={{fontWeight:700}}>{s.value}</div>
              </div>
            ))}
            <div className="muted small" style={{textAlign:'center',marginTop:8}}>Avg. Resolution Time: 2.3 days</div>
          </div>
        </div>

  <div className="card stat-card fade-in stagger-child" style={{animationDelay:'400ms'}}>
          <h4 className="card-heading">Environmental Impact</h4>
          <p className="small muted">Sustainability metrics</p>
          <div style={{marginTop:12,display:'grid',gap:10}}>
            <div style={{background:'rgba(16,185,129,0.06)',padding:12,borderRadius:8,textAlign:'center'}}>
              <div style={{fontSize:22,fontWeight:800,color:'var(--green-800)'}}>{environmental.co2Saved}</div>
              <div className="muted small">CO₂ Saved This Month</div>
            </div>

            <div style={{background:'rgba(99,102,241,0.06)',padding:12,borderRadius:8,textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:800,color:'#4F46E5'}}>{environmental.materialsRecycled}</div>
              <div className="muted small">Materials Recycled</div>
            </div>

            <div style={{background:'rgba(236,72,153,0.04)',padding:12,borderRadius:8,textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:800,color:'#DB2777'}}>{environmental.wasteReduction}</div>
              <div className="muted small">Waste Reduction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
