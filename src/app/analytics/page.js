"use client";
import React, { useEffect, useState } from 'react';
import HeaderButtons from '../../components/HeaderButtons';
import AnalyticsPanel, { getAnalyticsMockData } from '../../components/AnalyticsPanel';
import Brand from '../../components/Brand';
import { supabase } from '../../lib/supabase/supabase';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage(){
  const router = useRouter();
  const [accessChecked, setAccessChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkAccess(){
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId){
        router.replace('/signin');
        if (mounted){ setAllowed(false); setAccessChecked(true); }
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      const isResident = (profile?.role || '').toLowerCase() === 'resident';
      if (isResident){
        router.replace('/dashboard');
        if (mounted){ setAllowed(false); setAccessChecked(true); }
        return;
      }
      if (mounted){ setAllowed(true); setAccessChecked(true); }
    }
    checkAccess();
    return ()=> { mounted = false; };
  }, [router]);

  if (!accessChecked){
    return (
      <div className="container" style={{padding:'28px 0'}}>
        <p className="muted">Checking access…</p>
      </div>
    );
  }

  if (!allowed){
    return null;
  }
  function exportReport(){
    const data = getAnalyticsMockData();
    // Build a simple CSV with key sections
    const rows = [];
    rows.push(['Section','Key','Value']);

    // Metrics
    rows.push(['Metrics','Total Collections', data.metrics.totalCollections]);
    rows.push(['Metrics','Total Collections Δ (%)', data.metrics.totalCollectionsDelta]);
    rows.push(['Metrics','Recycling Rate (%)', data.metrics.recyclingRate]);
    rows.push(['Metrics','Active Reports', data.metrics.activeReports]);
    rows.push(['Metrics','Community Score', data.metrics.communityScore]);

    // Waste composition
    data.wasteComposition.forEach(w => rows.push(['Waste Composition', w.label, w.value + '%']));

    // Collection efficiency
    data.collectionEfficiency.forEach(c => rows.push(['Collection Efficiency', c.label, c.value]));

    // Issue stats
    data.issueStats.forEach(i => rows.push(['Issue Stats', i.label, i.value]));

    // Environmental
    rows.push(['Environmental','CO2 Saved', data.environmental.co2Saved]);
    rows.push(['Environmental','Materials Recycled', data.environmental.materialsRecycled]);
    rows.push(['Environmental','Waste Reduction', data.environmental.wasteReduction]);

    const csv = rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <header className="dashboard-header">
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Brand />
          </div>

          <div className="header-actions">
            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              <div className="muted small">This Month</div>
              <button
                className="cta-pill small header-export-cta export-btn"
                onClick={exportReport}
                aria-label="Export analytics report"
                title="Export analytics report as CSV"
              >
                Export Report
              </button>
              <HeaderButtons />
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{padding:'28px 0'}}>
        <h1 style={{marginBottom:6}}>Analytics Dashboard</h1>
        <p className="muted">Community waste management insights and performance metrics</p>

        <div style={{marginTop:18}}>
          <AnalyticsPanel />
        </div>
      </main>
    </div>
  );
}
