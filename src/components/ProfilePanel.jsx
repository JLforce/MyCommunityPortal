"use client";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function ProfilePanel(){
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({
    fullName: 'Unknown User',
    email: 'user@example.com',
    phone: '',
    role: 'City Official'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState('/avatar-default.svg');
  const fileRef = useRef();

  // Fetch profile data from database
  useEffect(() => {
    fetchProfileData();
  }, [user, authLoading]);

  async function fetchProfileData() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile({
          fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User',
          email: data.email || user.email || 'user@example.com',
          phone: data.phone || '',
          role: data.role === 'city_official' ? 'City Official' : 
                data.role === 'resident' ? 'Resident' : 
                data.role === 'collector' ? 'Collector' : 'City Official'
        });
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  function onPickAvatar(){
    if (fileRef.current) fileRef.current.click();
  }

  function onFile(e){
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
  }

  function handleSave(e){
    e.preventDefault();
    if (!user) {
      alert('You must be signed in to save changes');
      return;
    }

    setSaving(true);
    
    // Split fullName into first_name and last_name
    const nameParts = profile.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update profile in database
    supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: profile.email,
        phone: profile.phone
      })
      .eq('id', user.id)
      .then(({ error }) => {
        setSaving(false);
        if (error) {
          console.error('Error saving profile:', error);
          alert('Error saving profile: ' + error.message);
        } else {
          alert('Profile saved successfully!');
        }
      });
  }

  function handleCancel() {
    setAvatar('/avatar-default.svg');
    fetchProfileData();
  }

  if (authLoading || loading) {
    return (
      <div style={{paddingTop:8}}>
        <h1 style={{fontSize:28,fontWeight:800,color:'#064e3b',marginBottom:6}}>Profile</h1>
        <p style={{marginTop:0,color:'#6b7280',marginBottom:18}}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{paddingTop:8}}>
      <h1 style={{fontSize:28,fontWeight:800,color:'#064e3b',marginBottom:6}}>Profile</h1>
      <p style={{marginTop:0,color:'#6b7280',marginBottom:18}}>Manage your account information</p>

      <form onSubmit={handleSave} style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:28,alignItems:'start'}}>
        <div style={{background:'#fff',borderRadius:14,padding:22,boxShadow:'0 12px 30px rgba(2,6,23,0.06)'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <div style={{width:160,height:160,borderRadius:20,overflow:'hidden',background:'#ECFDF5',display:'grid',placeItems:'center',boxShadow:'inset 0 6px 10px rgba(255,255,255,0.6)'}}>
              <img src={avatar} alt="Avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{display:'flex',gap:10}}>
              <button type="button" onClick={onPickAvatar} style={{background:'#065f46',color:'#fff',border:'none',padding:'10px 16px',borderRadius:12,cursor:'pointer',fontWeight:800,boxShadow:'0 8px 20px rgba(6,95,46,0.12)'}}>Upload</button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:'none'}} />
              <button type="button" onClick={() => setAvatar('/avatar-default.svg')} style={{background:'#fff',border:'1px solid #D1FAE5',padding:'10px 16px',borderRadius:12}}>Remove</button>
            </div>
            <div style={{fontSize:13,color:'#6b7280'}}>Recommended: 400x400px JPG or PNG</div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <section style={{background:'#fff',borderRadius:10,padding:18,boxShadow:'0 6px 20px rgba(2,6,23,0.04)'}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:'#065f46'}}>Account Information</h3>
            <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <label>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Full Name</div>
                <input value={profile.fullName} onChange={(e)=>setProfile(p=>({...p,fullName:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB'}} />
              </label>
              <label>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Email</div>
                <input value={profile.email} onChange={(e)=>setProfile(p=>({...p,email:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB'}} />
              </label>
              <label>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Phone</div>
                <input value={profile.phone} onChange={(e)=>setProfile(p=>({...p,phone:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB'}} />
              </label>
              <label>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Role</div>
                <input value={profile.role} readOnly style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F3F9F6'}} />
              </label>
            </div>
          </section>

          <section style={{background:'#fff',borderRadius:10,padding:18,boxShadow:'0 6px 20px rgba(2,6,23,0.04)'}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:'#065f46'}}>Security</h3>
            <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,alignItems:'center'}}>
              <div>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Change Password</div>
                <div style={{display:'flex',gap:8}}>
                  <button type="button" onClick={()=>alert('Change password flow (demo)')} style={{background:'#fff',border:'1px solid #D1FAE5',padding:'10px 14px',borderRadius:10}}>Change Password</button>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:13,color:'#6b7280'}}>Last sign-in: 2 days ago</div>
              </div>
            </div>
          </section>

          <div style={{display:'flex',gap:12,marginTop:8,marginBottom:28}}>
            <button type="submit" disabled={saving} style={{background:'#064e3b',color:'#fff',padding:'12px 22px',borderRadius:14,border:'none',fontWeight:900,boxShadow:'0 12px 30px rgba(6,95,46,0.18)',transform:'translateY(0)'}}>{saving ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" onClick={handleCancel} style={{background:'#fff',border:'1px solid #D1FAE5',padding:'10px 16px',borderRadius:12}}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
