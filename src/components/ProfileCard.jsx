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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [zip, setZip] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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
      if (profile.municipality) setMunicipality(profile.municipality);
      if (profile.zip_code) setZip(profile.zip_code);
      if (profile.role) setRole(profile.role);
      // Load avatar from database if available
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
        setAvatar(profile.avatar_url);
      }
    } else {
      setDisplayName(user.email?.split('@')[0] || 'User');
    }

    // Fallback to localStorage if no avatar_url in database
    if (!avatarUrl) {
      const a = localStorage.getItem('mcp_avatar');
      if (a) setAvatar(a);
    }
  },[user, profile]);

  async function onSelectAvatar(file){
    if (!file || !userId) return;
    
    setUploadingAvatar(true);
    
    try {
      // Create a preview immediately
      const reader = new FileReader();
      reader.onload = function(ev){
        const data = ev.target.result;
        setAvatar(data);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const bucketName = 'avatars';

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        // If bucket doesn't exist, try 'profile-pictures' or create a fallback
        console.error('Upload error:', uploadError);
        // Try alternative bucket name
        const altBucketName = 'profile-pictures';
        const { data: altUploadData, error: altUploadError } = await supabase.storage
          .from(altBucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (altUploadError) {
          throw new Error(altUploadError.message || 'Failed to upload avatar');
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(altBucketName)
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
        }
      } else {
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
        } else {
          // Clear localStorage since we're using database now
          try { localStorage.removeItem('mcp_avatar'); } catch(e){}
        }
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Failed to upload avatar: ' + (err.message || 'Unknown error'));
      // Revert to previous avatar
      if (avatarUrl) {
        setAvatar(avatarUrl);
      } else {
        setAvatar(null);
      }
    } finally {
      setUploadingAvatar(false);
    }
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
            municipality: municipality,
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

  async function handleClearAvatar(){
    if (!userId) return;
    
    try {
      // Remove from database
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (error) {
        console.error('Error removing avatar:', error);
        alert('Failed to remove avatar');
        return;
      }

      setAvatar(null);
      setAvatarUrl(null);
      try{ localStorage.removeItem('mcp_avatar'); }catch(e){}
    } catch (err) {
      console.error('Error removing avatar:', err);
      alert('Failed to remove avatar');
    }
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

        <div className="profile-card-actions" style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {!editing ? (
            <>
              <button className="btn" onClick={()=>setEditing(true)}>Edit profile</button>
              <button 
                className="btn btn-light" 
                onClick={()=>fileRef.current && fileRef.current.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? 'Uploading...' : 'Change avatar'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=> onSelectAvatar(e.target.files && e.target.files[0])} />
            </>
          ) : (
            <form className="profile-card-edit-form" onSubmit={handleSave} style={{display:'flex',gap:8,alignItems:'center'}}>
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
                  <label className="small" style={{display:'block',marginBottom:6}}>Municipality</label>
                  <input value={municipality} onChange={e=>setMunicipality(e.target.value)} placeholder="Municipality" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)',boxSizing:'border-box'}} />
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
                  <label className="small muted">Municipality</label>
                  <p style={{margin:0}}>{municipality || '—'}</p>
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
