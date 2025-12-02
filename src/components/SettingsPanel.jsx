"use client";
import { useState } from 'react';

export default function SettingsPanel(){
  const [general, setGeneral] = useState({
    barangayName: 'Barangay A',
    contactEmail: 'barangay@example.com',
    contactPhone: '09123456789'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    weeklyReports: true
  });

  const [pickup, setPickup] = useState({
    defaultTime: 'Morning (6 AM - 12 PM)',
    maxPerDay: 50
  });

  const [saving, setSaving] = useState(false);

  function handleSave(e){
    e.preventDefault();
    setSaving(true);
    // simulate save
    setTimeout(()=>{
      setSaving(false);
      alert('Settings saved (demo)');
    },700);
  }

  function handleCancel(){
    // reset demo values or navigate away in real app
    setGeneral({ barangayName:'Barangay A', contactEmail:'barangay@example.com', contactPhone:'09123456789' });
    setNotifications({ email:true, sms:true, push:false, weeklyReports:true });
    setPickup({ defaultTime:'Morning (6 AM - 12 PM)', maxPerDay:50 });
  }

  return (
    <div style={{paddingTop:8}}>
      <h1 style={{fontSize:28,fontWeight:800,color:'#064e3b',marginBottom:6}}>Settings</h1>
      <p style={{marginTop:0,color:'#6b7280',marginBottom:18}}>Manage system preferences and configuration</p>

      <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:18}}>
        <section style={{background:'#fff',borderRadius:10,padding:18,boxShadow:'0 6px 20px rgba(2,6,23,0.04)'}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:700,color:'#064e3b'}}>General Settings</h3>
          <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr',gap:12}}>
            <label style={{display:'block'}}>
              <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Barangay Name</div>
              <input value={general.barangayName} onChange={(e)=>setGeneral(g=>({...g,barangayName:e.target.value}))} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #D1FAE5',background:'#FAFFFB'}} />
            </label>

            <label style={{display:'block'}}>
              <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Contact Email</div>
              <input value={general.contactEmail} onChange={(e)=>setGeneral(g=>({...g,contactEmail:e.target.value}))} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #D1FAE5',background:'#FAFFFB'}} />
            </label>

            <label style={{display:'block'}}>
              <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Contact Phone</div>
              <input value={general.contactPhone} onChange={(e)=>setGeneral(g=>({...g,contactPhone:e.target.value}))} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #D1FAE5',background:'#FAFFFB'}} />
            </label>
          </div>
        </section>

        <section style={{background:'#fff',borderRadius:10,padding:18,boxShadow:'0 6px 20px rgba(2,6,23,0.04)'}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:700,color:'#064e3b'}}>Notification Settings</h3>
          <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 160px',gap:12,alignItems:'center'}}>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <label style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>Email Notifications</span>
                <input type="checkbox" checked={notifications.email} onChange={(e)=>setNotifications(n=>({...n,email:e.target.checked}))} />
              </label>
              <label style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>SMS Alerts</span>
                <input type="checkbox" checked={notifications.sms} onChange={(e)=>setNotifications(n=>({...n,sms:e.target.checked}))} />
              </label>
              <label style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>Push Notifications</span>
                <input type="checkbox" checked={notifications.push} onChange={(e)=>setNotifications(n=>({...n,push:e.target.checked}))} />
              </label>
              <label style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>Weekly Reports</span>
                <input type="checkbox" checked={notifications.weeklyReports} onChange={(e)=>setNotifications(n=>({...n,weeklyReports:e.target.checked}))} />
              </label>
            </div>
            <div></div>
          </div>
        </section>

        <section style={{background:'#fff',borderRadius:10,padding:18,boxShadow:'0 6px 20px rgba(2,6,23,0.04)'}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:700,color:'#064e3b'}}>Pickup Schedule</h3>
          <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <label>
              <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Default Pickup Time</div>
              <input value={pickup.defaultTime} onChange={(e)=>setPickup(p=>({...p,defaultTime:e.target.value}))} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #D1FAE5',background:'#FAFFFB'}} />
            </label>
            <label>
              <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Max Requests Per Day</div>
              <input type="number" value={pickup.maxPerDay} onChange={(e)=>setPickup(p=>({...p,maxPerDay:parseInt(e.target.value||0)}))} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid #D1FAE5',background:'#FAFFFB'}} />
            </label>
          </div>
        </section>

        <div style={{display:'flex',gap:12,marginTop:4,marginBottom:20}}>
          <button type="submit" disabled={saving} style={{background:'#065f46',color:'#fff',padding:'10px 18px',borderRadius:8,border:'none',fontWeight:800,boxShadow:'0 8px 24px rgba(6,95,46,0.12)'}}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={handleCancel} style={{background:'transparent',border:'1px solid #D1FAE5',padding:'10px 18px',borderRadius:8}}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
