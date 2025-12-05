"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function PickupDetailsClient() {
  const router = useRouter();
  const params = useSearchParams();

  // Demo data; in production fetch by id from params.get('id')
  const pickup = useMemo(() => ({
    id: params.get('id') || 'demo',
    name: params.get('name') || 'Jane Alice Cruz',
    status: params.get('status') || 'scheduled',
    type: params.get('type') || 'Special Pickup',
    datetime: params.get('datetime') || '2025-12-15T08:00:00',
    address: params.get('address') || 'R. Padilla (Fatima) St., Duljo (Pob.), City of Cebu, Cebu',
    notes: params.get('notes') || 'Large item collection. Please ensure items are curbside by 7:30 AM.',
    contact: params.get('contact') || '0955 123 4567',
  }), [params]);

  const badge = getBadge(pickup.status);

  function closeModal() {
    router.back();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.45)',zIndex:1400,padding:20}}
      onClick={closeModal}
    >
      <div
        style={{background:'#fff',borderRadius:16,maxWidth:640,width:'100%',boxShadow:'0 18px 60px rgba(2,6,23,0.24)',overflow:'hidden'}}
        onClick={e=>e.stopPropagation()}
      >
        <div style={{padding:'22px 22px 14px',borderBottom:'1px solid #eef2f7',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
              <h2 style={{margin:0,fontSize:26,fontWeight:800,color:'#0f172a'}}>{pickup.type}</h2>
              <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:999,background:badge.bg,color:badge.color,fontSize:13,fontWeight:700}}>
                {badge.icon}
                {badge.label}
              </span>
            </div>
            <div style={{color:'#6b7280',fontSize:14}}>Pickup ID: {pickup.id}</div>
          </div>
          <button onClick={closeModal} aria-label="Close" style={{background:'transparent',border:'none',padding:8,cursor:'pointer',fontSize:22,lineHeight:1}}>
            ✕
          </button>
        </div>

        <div style={{padding:22,display:'grid',gridTemplateColumns:'1fr',gap:18}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Detail label="Resident" value={pickup.name} />
            <Detail label="Contact" value={pickup.contact} />
            <Detail label="Schedule" value={formatDate(pickup.datetime)} />
            <Detail label="Address" value={pickup.address} />
          </div>

          <div style={{padding:14,borderRadius:12,border:'1px solid #e5e7eb',background:'#f9fafb'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#111827',marginBottom:8}}>Notes</div>
            <div style={{fontSize:14,color:'#374151',lineHeight:1.5}}>{pickup.notes}</div>
          </div>
        </div>

        <div style={{padding:'14px 22px 20px',display:'flex',justifyContent:'flex-end',gap:10,borderTop:'1px solid #eef2f7'}}>
          <button onClick={closeModal} style={{background:'#fff',border:'1px solid #d1fae5',color:'#065f46',padding:'10px 16px',borderRadius:10,fontWeight:700,cursor:'pointer'}}>Close</button>
          <button style={{background:'#065f46',border:'none',color:'#fff',padding:'10px 18px',borderRadius:10,fontWeight:800,boxShadow:'0 12px 24px rgba(6,95,46,0.18)',cursor:'pointer'}}>Mark as Completed</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{padding:14,borderRadius:12,border:'1px solid #e5e7eb',background:'#fff'}}>
      <div style={{fontSize:12,color:'#6b7280',textTransform:'uppercase',letterSpacing:0.4,marginBottom:6}}>{label}</div>
      <div style={{fontSize:15,color:'#111827',fontWeight:600,lineHeight:1.4}}>{value || '—'}</div>
    </div>
  );
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function getBadge(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('completed') || s.includes('done')) {
    return { label: 'Completed', bg: '#dff6e6', color: '#065f46', icon: checkIcon('#065f46') };
  }
  if (s.includes('cancel')) {
    return { label: 'Cancelled', bg: '#fee2e2', color: '#b91c1c', icon: crossIcon('#b91c1c') };
  }
  return { label: 'Scheduled', bg: '#fef3c7', color: '#b45309', icon: clockIcon('#b45309') };
}

function checkIcon(color) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill={color} opacity="0.12" />
      <path d="M9 12.5l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function clockIcon(color) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function crossIcon(color) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill={color} opacity="0.12" />
      <path d="M9 9l6 6M15 9l-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
