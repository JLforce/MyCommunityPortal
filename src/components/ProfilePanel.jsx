"use client";
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabase';

function toFullName(first, last) {
  const fn = first || '';
  const ln = last || '';
  return `${fn} ${ln}`.trim() || 'Unknown User';
}

export default function ProfilePanel({ userId, initialProfile = {} }) {
  const [profile, setProfile] = useState({
    fullName: toFullName(initialProfile.first_name, initialProfile.last_name),
    email: initialProfile.email || '',
    phone: initialProfile.phone || '',
    role: initialProfile.role || 'City Official',
    municipality: initialProfile.municipality || '',
    barangay: initialProfile.barangay || '',
    street_address: initialProfile.street_address || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState(initialProfile.avatar_url || '/avatar-default.svg');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || null);
  const fileRef = useRef();

  useEffect(() => {
    setProfile({
      fullName: toFullName(initialProfile.first_name, initialProfile.last_name),
      email: initialProfile.email || '',
      phone: initialProfile.phone || '',
      role: initialProfile.role || 'City Official',
      municipality: initialProfile.municipality || '',
      barangay: initialProfile.barangay || '',
      street_address: initialProfile.street_address || '',
    });
    // Update avatar when initialProfile changes
    if (initialProfile.avatar_url) {
      setAvatar(initialProfile.avatar_url);
      setAvatarUrl(initialProfile.avatar_url);
    } else {
      setAvatar('/avatar-default.svg');
      setAvatarUrl(null);
    }
  }, [initialProfile]);

  function onPickAvatar(){
    if (fileRef.current) fileRef.current.click();
  }

  async function onFile(e){
    const f = e.target.files && e.target.files[0];
    if (!f || !userId) return;
    
    setUploadingAvatar(true);
    
    try {
      // Create a preview immediately
      const reader = new FileReader();
      reader.onload = function(ev){
        const data = ev.target.result;
        setAvatar(data);
      };
      reader.readAsDataURL(f);

      // Upload to Supabase Storage
      const fileExt = f.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const bucketName = 'avatars';

      // Delete old avatar if exists
      if (avatarUrl && avatarUrl.includes('/storage/v1/object/public/avatars/')) {
        try {
          const oldFileName = avatarUrl.split('/avatars/')[1];
          if (oldFileName) {
            await supabase.storage.from(bucketName).remove([oldFileName]);
          }
        } catch (err) {
          console.warn('Could not delete old avatar:', err);
        }
      }

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, f, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload avatar');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      setAvatarUrl(publicUrl);
      setAvatar(publicUrl);

      // Save URL to database
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (dbError) {
        console.error('Error saving avatar URL:', dbError);
        alert('Avatar uploaded but failed to save URL to database');
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert(err.message || 'Failed to upload avatar');
      // Revert to previous avatar on error
      setAvatar(avatarUrl || '/avatar-default.svg');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!userId || !avatarUrl) return;
    
    setUploadingAvatar(true);
    try {
      // Delete from storage
      if (avatarUrl.includes('/storage/v1/object/public/avatars/')) {
        const fileName = avatarUrl.split('/avatars/')[1];
        if (fileName) {
          await supabase.storage.from('avatars').remove([fileName]);
        }
      }

      // Update database
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (dbError) {
        console.error('Error removing avatar URL:', dbError);
        alert('Failed to remove avatar from database');
      } else {
        setAvatar('/avatar-default.svg');
        setAvatarUrl(null);
      }
    } catch (err) {
      console.error('Error removing avatar:', err);
      alert('Failed to remove avatar');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave(e){
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      const [firstName, ...rest] = (profile.fullName || '').trim().split(' ');
      const lastName = rest.join(' ');

      const updateData = {
        first_name: firstName || null,
        last_name: lastName || null,
        email: profile.email || null,
        phone: profile.phone || null,
        street_address: profile.street_address || null,
        barangay: profile.barangay || null,
        municipality: profile.municipality || null,
      };

      // Include avatar_url if it was updated
      if (avatarUrl !== null) {
        updateData.avatar_url = avatarUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Failed to save profile.');
      } else {
        alert('Profile saved.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{paddingTop:8}}>
      <h1 style={{fontSize:'clamp(24px, 5vw, 28px)',fontWeight:800,color:'#064e3b',marginBottom:6}}>Profile</h1>
      <p style={{marginTop:0,color:'#6b7280',marginBottom:18,fontSize:'clamp(13px, 2vw, 14px)'}}>Manage your account information</p>

      <form onSubmit={handleSave} style={{display:'grid',gridTemplateColumns:'minmax(280px, 320px) 1fr',gap:'clamp(20px, 4vw, 28px)',alignItems:'start'}} className="profile-form">
        <div style={{background:'#fff',borderRadius:14,padding:'clamp(16px, 3vw, 22px)',boxShadow:'0 12px 30px rgba(2,6,23,0.06)'}} className="profile-avatar-section">
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <div style={{width:'clamp(120px, 20vw, 160px)',height:'clamp(120px, 20vw, 160px)',borderRadius:20,overflow:'hidden',background:'#ECFDF5',display:'grid',placeItems:'center',boxShadow:'inset 0 6px 10px rgba(255,255,255,0.6)',position:'relative'}}>
              {uploadingAvatar && (
                <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',display:'grid',placeItems:'center',zIndex:10,borderRadius:20}}>
                  <div style={{color:'#fff',fontSize:14}}>Uploading...</div>
                </div>
              )}
              <img src={avatar} alt="Avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',width:'100%'}} className="profile-avatar-actions">
              <button type="button" onClick={onPickAvatar} disabled={uploadingAvatar} style={{background:'#065f46',color:'#fff',border:'none',padding:'10px 16px',borderRadius:12,cursor:uploadingAvatar ? 'not-allowed' : 'pointer',fontWeight:800,boxShadow:'0 8px 20px rgba(6,95,46,0.12)',opacity:uploadingAvatar ? 0.6 : 1,flex:'1 1 auto',minWidth:'120px'}}>
                {uploadingAvatar ? 'Uploading...' : 'Upload'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:'none'}} />
              <button type="button" onClick={handleRemoveAvatar} disabled={uploadingAvatar || !avatarUrl} style={{background:'#fff',border:'1px solid #D1FAE5',padding:'10px 16px',borderRadius:12,cursor:uploadingAvatar || !avatarUrl ? 'not-allowed' : 'pointer',opacity:uploadingAvatar || !avatarUrl ? 0.5 : 1,flex:'1 1 auto',minWidth:'120px'}}>Remove</button>
            </div>
           {/* <div style={{fontSize:13,color:'#6b7280',textAlign:'center'}}>Recommended: 400x400px JPG or PNG</div>*/}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:20,minWidth:0}} className="profile-form-fields">
          <section style={{background:'#fff',borderRadius:10,padding:'clamp(16px, 3vw, 18px)',boxShadow:'0 6px 20px rgba(2,6,23,0.04)'}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:'#065f46'}}>Account Information</h3>
            <div style={{marginTop:14,display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:14}} className="profile-form-grid">
              <label style={{display:'block'}}>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Full Name</div>
                <input value={profile.fullName} onChange={(e)=>setProfile(p=>({...p,fullName:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB',fontSize:16,boxSizing:'border-box'}} />
              </label>
              <label style={{display:'block'}}>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Email</div>
                <input type="email" value={profile.email} onChange={(e)=>setProfile(p=>({...p,email:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB',fontSize:16,boxSizing:'border-box'}} />
              </label>
              <label style={{display:'block'}}>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Phone</div>
                <input type="tel" value={profile.phone} onChange={(e)=>setProfile(p=>({...p,phone:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB',fontSize:16,boxSizing:'border-box'}} />
              </label>
              <label style={{display:'block'}}>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Role</div>
                <input value={profile.role} readOnly style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F3F9F6',fontSize:16,boxSizing:'border-box'}} />
              </label>
              <label style={{display:'block'}}>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Municipality</div>
                <input value={profile.municipality} onChange={(e)=>setProfile(p=>({...p,municipality:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB',fontSize:16,boxSizing:'border-box'}} />
              </label>
              <label style={{display:'block'}}>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Barangay</div>
                <input value={profile.barangay} onChange={(e)=>setProfile(p=>({...p,barangay:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB',fontSize:16,boxSizing:'border-box'}} />
              </label>
              <label style={{display:'block',gridColumn:'1 / -1'}}>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Street Address</div>
                <input value={profile.street_address} onChange={(e)=>setProfile(p=>({...p,street_address:e.target.value}))} style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid #D1FAE5',background:'#F8FFFB',fontSize:16,boxSizing:'border-box'}} />
              </label>
            </div>
          </section>

          <section style={{background:'#fff',borderRadius:10,padding:'clamp(16px, 3vw, 18px)',boxShadow:'0 6px 20px rgba(2,6,23,0.04)'}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:'#065f46'}}>Security</h3>
            <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,alignItems:'center'}} className="profile-security-section">
              <div>
                <div style={{fontSize:13,color:'#374151',marginBottom:6}}>Change Password</div>
                <div style={{display:'flex',gap:8}}>
                  <button type="button" onClick={()=>alert('Change password flow (demo)')} style={{background:'#fff',border:'1px solid #D1FAE5',padding:'10px 14px',borderRadius:10,cursor:'pointer'}}>Change Password</button>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                {/*<div style={{fontSize:13,color:'#6b7280'}}>Last sign-in: 2 days ago</div>*/}
              </div>
            </div>
          </section>

          <div style={{display:'flex',gap:12,marginTop:8,marginBottom:28,flexWrap:'wrap'}} className="profile-form-actions">
            <button type="submit" disabled={saving || uploadingAvatar} style={{background:'#064e3b',color:'#fff',padding:'12px 22px',borderRadius:14,border:'none',fontWeight:900,boxShadow:'0 12px 30px rgba(6,95,46,0.18)',transform:'translateY(0)',cursor:saving || uploadingAvatar ? 'not-allowed' : 'pointer',opacity:saving || uploadingAvatar ? 0.6 : 1,flex:'1 1 auto',minWidth:'140px'}}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={()=>{
              setProfile({
                fullName: toFullName(initialProfile.first_name, initialProfile.last_name),
                email: initialProfile.email || '',
                phone: initialProfile.phone || '',
                role: initialProfile.role || 'City Official',
                municipality: initialProfile.municipality || '',
                barangay: initialProfile.barangay || '',
                street_address: initialProfile.street_address || '',
              });
              if (initialProfile.avatar_url) {
                setAvatar(initialProfile.avatar_url);
                setAvatarUrl(initialProfile.avatar_url);
              } else {
                setAvatar('/avatar-default.svg');
                setAvatarUrl(null);
              }
            }} style={{background:'#fff',border:'1px solid #D1FAE5',padding:'10px 16px',borderRadius:12,cursor:'pointer',flex:'1 1 auto',minWidth:'120px'}}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}
