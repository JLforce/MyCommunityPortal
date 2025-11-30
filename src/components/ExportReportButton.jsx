"use client";
import React from 'react';
import { getAnalyticsMockData } from './AnalyticsPanel';

export default function ExportReportButton({ className }){
  function exportReport(){
    const data = getAnalyticsMockData();
    const rows = [];
    rows.push(['Section','Key','Value']);
    rows.push(['Metrics','Total Collections', data.metrics.totalCollections]);
    rows.push(['Metrics','Total Collections Δ (%)', data.metrics.totalCollectionsDelta]);
    rows.push(['Metrics','Recycling Rate (%)', data.metrics.recyclingRate]);
    rows.push(['Metrics','Active Reports', data.metrics.activeReports]);
    rows.push(['Metrics','Community Score', data.metrics.communityScore]);
    data.wasteComposition.forEach(w => rows.push(['Waste Composition', w.label, w.value + '%']));
    data.collectionEfficiency.forEach(c => rows.push(['Collection Efficiency', c.label, c.value]));
    data.issueStats.forEach(i => rows.push(['Issue Stats', i.label, i.value]));
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
    <button
      className={className || 'cta-pill small header-export-cta export-btn'}
      onClick={exportReport}
      aria-label="Export analytics report"
      title="Export analytics report as CSV"
    >
      Export Report
    </button>
  );
}
"use client";
import React from 'react';
import { getAnalyticsMockData } from './AnalyticsPanel';

export default function ExportReportButton({ className }){
  function exportReport(){
    const data = getAnalyticsMockData();
    const rows = [];
    rows.push(['Section','Key','Value']);
    rows.push(['Metrics','Total Collections', data.metrics.totalCollections]);
    rows.push(['Metrics','Total Collections Δ (%)', data.metrics.totalCollectionsDelta]);
    rows.push(['Metrics','Recycling Rate (%)', data.metrics.recyclingRate]);
    rows.push(['Metrics','Active Reports', data.metrics.activeReports]);
    rows.push(['Metrics','Community Score', data.metrics.communityScore]);
    data.wasteComposition.forEach(w => rows.push(['Waste Composition', w.label, w.value + '%']));
    data.collectionEfficiency.forEach(c => rows.push(['Collection Efficiency', c.label, c.value]));
    data.issueStats.forEach(i => rows.push(['Issue Stats', i.label, i.value]));
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
    <button
      className={className || 'cta-pill small header-export-cta export-btn'}
      onClick={exportReport}
      aria-label="Export analytics report"
      title="Export analytics report as CSV"
    >
      Export Report
    </button>
  );
}
