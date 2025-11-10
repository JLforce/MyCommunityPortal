"use client";
import React from 'react';
import HeaderButtons from '../../components/HeaderButtons';
import AnalyticsPanel, { getAnalyticsMockData } from '../../components/AnalyticsPanel';

export default function AnalyticsPage(){
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
            <div className="brand-logo small">MC</div>
            <div className="brand-text">Analytics Dashboard</div>
          </div>

          <div className="header-actions">
            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              <div className="muted small">This Month</div>
              <button
                className="cta-pill small header-export-cta"
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
