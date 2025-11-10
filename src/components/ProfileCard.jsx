"use client";
import { useState, useEffect, useRef } from 'react';

export default function ProfileCard(){
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const fileRef = useRef();

  useEffect(()=>{
    try{
      const a = localStorage.getItem('mcp_avatar');
      const dn = localStorage.getItem('mcp_displayName');
      const em = localStorage.getItem('mcp_email');
      if (a) setAvatar(a);
      if (dn) setDisplayName(dn);
      if (em) setEmail(em);
    }catch(e){}
  },[]);

  function onSelectAvatar(file){
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      const data = ev.target.result;
      setAvatar(data);
      try{ localStorage.setItem('mcp_avatar', data); }catch(e){}
    };
    reader.readAsDataURL(file);
  }

  function handleSave(e){
    e?.preventDefault();
    try{ localStorage.setItem('mcp_displayName', displayName); localStorage.setItem('mcp_email', email); }catch(e){}
    setEditing(false);
  }

  function handleClearAvatar(){
    setAvatar(null);
    try{ localStorage.removeItem('mcp_avatar'); }catch(e){}
  }

  return (
    <div>
      <div className="card" style={{display:'flex',gap:18,alignItems:'center',padding:'20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:96,height:96,borderRadius:12,overflow:'hidden',background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(0,0,0,0.03)'}}>
            {avatar ? (
              <img src={avatar} alt="Profile avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            ) : (
              <img src="/avatar-default.svg" alt="Default avatar" style={{width:'80%',height:'80%'}} />
            )}
          </div>
          <div>
            <h3 style={{margin:0,fontSize:20}}>{displayName}</h3>
            <div className="muted small" style={{marginTop:6}}>{email}</div>
          </div>
        </div>

        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {!editing ? (
            <>
              <button className="btn" onClick={()=>setEditing(true)}>Edit profile</button>
              <button className="btn btn-light" onClick={()=>fileRef.current && fileRef.current.click()}>Change avatar</button>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=> onSelectAvatar(e.target.files && e.target.files[0])} />
            </>
          ) : (
            <form onSubmit={handleSave} style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={displayName} onChange={e=>setDisplayName(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid var(--border)'}} />
              <input value={email} onChange={e=>setEmail(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid var(--border)'}} />
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn" onClick={()=>setEditing(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>

      <div style={{marginTop:14,display:'grid',gap:12}}>
        <div className="card">
          <h4>About</h4>
          <p className="muted small">This is your public profile information. Keep your display name and contact details up-to-date so neighbors can recognize you when coordinating pickups or community events.</p>
        </div>

        <div className="card">
          <h4>Recent activity</h4>
          <p className="small muted">No recent activity to show. Your reports and pickups will appear here.</p>
        </div>

        <div className="card">
          <h4>Security</h4>
          <p className="small muted">Manage sessions, password and two-factor authentication in Settings.</p>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <a className="btn" href="/settings">Open settings</a>
            <button className="btn btn-light" onClick={handleClearAvatar}>Remove avatar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
