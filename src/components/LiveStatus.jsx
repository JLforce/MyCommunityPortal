"use client";
import React, { useEffect, useState } from 'react';

export default function LiveStatus({pollInterval = 15000}){
  const [status, setStatus] = useState({ state: 'loading', checked: null });

  useEffect(() => {
    let mounted = true;

    async function fetchStatus(){
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if(!res.ok) throw new Error('Network');
        const json = await res.json();
        if(mounted) setStatus({ state: json.status || 'unknown', checked: json.checked || new Date().toISOString() });
      } catch (e) {
        if(mounted) setStatus({ state: 'offline', checked: new Date().toISOString() });
      }
    }

    fetchStatus();
    const id = setInterval(fetchStatus, pollInterval);
    return () => { mounted = false; clearInterval(id); };
  }, [pollInterval]);

  const color = status.state === 'ok' ? '#10b981' : status.state === 'degraded' ? '#f59e0b' : '#ef4444';
  const label = status.state === 'ok' ? 'All systems operational' : status.state === 'degraded' ? 'Partial outage' : status.state === 'offline' ? 'Offline' : 'Checking...';

  return (
    <div style={{display:'flex',alignItems:'center',gap:8}} aria-live="polite">
      <span style={{display:'inline-block',width:10,height:10,background:color,borderRadius:999}} aria-hidden></span>
      <div style={{display:'flex',flexDirection:'column'}}>
        <div style={{fontWeight:700, fontSize:14}}>{label}</div>
        <div style={{fontSize:12,color:'var(--text-600)'}}>{status.checked ? new Date(status.checked).toLocaleString() : '—'}</div>
      </div>
    </div>
  );
}
