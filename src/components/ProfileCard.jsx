"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProfileCard({ user, profile }){
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const fileRef = useRef();

  useEffect(()=>{
    // Use the props passed from the server component
    if (!user) {
      setError('Please sign in to view your profile');
      return;
    }

    console.log('User from props:', user);
    console.log('Profile from props:', profile);

    setUserId(user.id);
    setEmail(user.email || '');

    if (profile) {
      setDisplayName(`${profile.first_name} ${profile.last_name}`.trim() || user.email?.split('@')[0]);
      if (profile.email) setEmail(profile.email);
      if (profile.phone) setPhone(profile.phone);
      if (profile.street_address) setStreet(profile.street_address);
      if (profile.city) setCity(profile.city);
      if (profile.zip_code) setZip(profile.zip_code);
      if (profile.role) setRole(profile.role);
    } else {
      setDisplayName(user.email?.split('@')[0] || 'User');
    }

    // Try to load avatar from localStorage
    const a = localStorage.getItem('mcp_avatar');
    if (a) setAvatar(a);
  },[user, profile]);

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

  async function handleSave(e){
    e?.preventDefault();
    try {
      if (userId) {
        // Update profile in Supabase
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            street_address: street,
            city: city,
            zip_code: zip,
            role: role
          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating profile:', error);
          alert('Failed to save profile changes');
          return;
        }
      }
      localStorage.setItem('mcp_displayName', displayName);
      localStorage.setItem('mcp_email', email);
    } catch(e) {
      console.error('Error saving profile:', e);
      alert('Failed to save profile changes');
    }
    setEditing(false);
  }

  function handleClearAvatar(){
    setAvatar(null);
    try{ localStorage.removeItem('mcp_avatar'); }catch(e){}
  }

  if (error) {
    return (
      <div className="card" style={{padding:'20px',textAlign:'center',background:'var(--red-50)',border:'1px solid var(--red-200)'}}>
        <p style={{color:'var(--red-900)',margin:0}}>{error}</p>
      </div>
    );
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
            <h3 style={{margin:0,fontSize:20}}>{displayName || 'Your Profile'}</h3>
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
              <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Full name" style={{padding:10,borderRadius:8,border:'1px solid var(--border)'}} />
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{padding:10,borderRadius:8,border:'1px solid var(--border)'}} />
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn" onClick={()=>setEditing(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>

      <div style={{marginTop:14,display:'grid',gap:12}}>
        <div className="card">
          <h4>Contact Information</h4>
          {editing ? (
            <form onSubmit={handleSave} style={{display:'grid',gap:12}}>
              <div>
                <label className="small" style={{display:'block',marginBottom:6}}>Phone</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)',boxSizing:'border-box'}} />
              </div>
              <div>
                <label className="small" style={{display:'block',marginBottom:6}}>Street Address</label>
                <input value={street} onChange={e=>setStreet(e.target.value)} placeholder="Street address" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)',boxSizing:'border-box'}} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <div>
                  <label className="small" style={{display:'block',marginBottom:6}}>City</label>
                  <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)',boxSizing:'border-box'}} />
                </div>
                <div>
                  <label className="small" style={{display:'block',marginBottom:6}}>ZIP Code</label>
                  <input value={zip} onChange={e=>setZip(e.target.value)} placeholder="ZIP code" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)',boxSizing:'border-box'}} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          ) : (
            <div style={{display:'grid',gap:10}}>
              <div>
                <label className="small muted">Phone</label>
                <p style={{margin:0}}>{phone || '—'}</p>
              </div>
              <div>
                <label className="small muted">Street Address</label>
                <p style={{margin:0}}>{street || '—'}</p>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <label className="small muted">City</label>
                  <p style={{margin:0}}>{city || '—'}</p>
                </div>
                <div>
                  <label className="small muted">ZIP Code</label>
                  <p style={{margin:0}}>{zip || '—'}</p>
                </div>
              </div>
              <div>
                <label className="small muted">Role</label>
                <p style={{margin:0}}>{role || '—'}</p>
              </div>
              <button className="btn" onClick={()=>setEditing(true)} style={{marginTop:8}}>Edit Information</button>
            </div>
          )}
        </div>

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
