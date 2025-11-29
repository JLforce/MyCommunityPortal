"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase/supabase';

export default function SettingsForm(){
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    emailNotifications: true,
    inAppNotifications: true,
    language: 'en',
    timezone: 'Asia/Manila',
    twoFactor: false
  });
  const [avatar, setAvatar] = useState(null);
  const fileRef = useRef();
  const [status, setStatus] = useState(null);
  const [userId, setUserId] = useState(null);

  function updateField(key, value){
    setForm(prev => ({ ...prev, [key]: value }));
  }

  useEffect(()=>{
    try{
      const stored = localStorage.getItem('mcp_avatar');
      if (stored) setAvatar(stored);
    }catch(e){}
  },[]);

  useEffect(()=>{
    let mounted = true;
    async function load(){
      try{
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user || null;
        if (!mounted) return;
        if (!user){
          setStatus({ ok: false, message: 'Please sign in to view settings' });
          return;
        }
        setUserId(user.id);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError){
          setStatus({ ok: false, message: 'Failed to load profile' });
        }

        const displayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || (user.email?.split('@')[0] || '') : (user.email?.split('@')[0] || '');
        const email = profile?.email || user.email || '';

        let prefs = null;
        try{
          const { data: settingsRow, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          if (!settingsError){
            prefs = settingsRow || null;
          }
        }catch(_e){}

        setForm(prev=>({
          ...prev,
          displayName,
          email,
          emailNotifications: prefs?.email_notifications ?? prev.emailNotifications,
          inAppNotifications: prefs?.in_app_notifications ?? prev.inAppNotifications,
          language: prefs?.language ?? prev.language,
          timezone: prefs?.timezone ?? prev.timezone,
          twoFactor: prefs?.two_factor ?? prev.twoFactor,
        }));
      }catch(e){
        setStatus({ ok: false, message: 'Unable to load settings' });
      }
    }
    load();
    return ()=>{ mounted = false; };
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

  async function handleSave(e){
    e?.preventDefault();
    setSaving(true);
    setStatus(null);
    try{
      if (!userId){
        setSaving(false);
        setStatus({ ok: false, message: 'Not signed in' });
        return;
      }

      const parts = (form.displayName || '').trim().split(' ');
      const first_name = parts[0] || '';
      const last_name = parts.slice(1).join(' ') || '';

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ first_name, last_name })
        .eq('id', userId);

      if (profileError){
        throw new Error(profileError.message || 'Profile update failed');
      }

      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          email_notifications: !!form.emailNotifications,
          in_app_notifications: !!form.inAppNotifications,
          language: form.language,
          timezone: form.timezone,
          two_factor: !!form.twoFactor,
        }, { onConflict: 'user_id' });

      if (settingsError){
        throw new Error(settingsError.message || 'Settings update failed');
      }

      setSaving(false);
      setStatus({ ok: true, message: 'Settings saved' });
      setTimeout(()=>setStatus(null), 3000);
    }catch(err){
      setSaving(false);
      setStatus({ ok: false, message: 'Failed to save settings' });
    }
  }

  return (
    <form onSubmit={handleSave} className="settings-form" style={{display:'flex',flexDirection:'column',gap:16}}>
      <section className="card" aria-labelledby="account-heading">
        <h3 id="account-heading">Account</h3>
        <p className="muted small">Change your display name and manage your email address.</p>

        <div style={{display:'grid',gap:10,marginTop:12}}>
          <label className="input-label">Display name</label>
          <div className="input-field">
            <input value={form.displayName} onChange={e=>updateField('displayName', e.target.value)} />
          </div>

          <label className="input-label">Email</label>
          <div className="input-field" style={{background:'#F9FAFB'}}>
            <input value={form.email} readOnly />
          </div>

          <div style={{display:'flex',gap:10,marginTop:8,alignItems:'center'}}>
            <button type="button" className="btn btn-light" onClick={()=>alert('Change password flow not implemented')}>Change password</button>
            <button type="button" className="btn" onClick={()=>fileRef.current && fileRef.current.click()}>Update avatar</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=> onSelectAvatar(e.target.files && e.target.files[0])} />
            {avatar && (
              <div style={{marginLeft:8}}>
                <img src={avatar} alt="Avatar preview" style={{width:40,height:40,borderRadius:999,objectFit:'cover',border:'2px solid #fff'}} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="notifications-heading">
        <h3 id="notifications-heading">Notifications</h3>
        <p className="muted small">Choose which notifications you receive.</p>

        <div style={{display:'grid',gap:12,marginTop:12}}>
          <label className="checkbox"><input type="checkbox" checked={form.emailNotifications} onChange={e=>updateField('emailNotifications', e.target.checked)} /> <span style={{marginLeft:8}}>Email notifications</span></label>
          <label className="checkbox"><input type="checkbox" checked={form.inAppNotifications} onChange={e=>updateField('inAppNotifications', e.target.checked)} /> <span style={{marginLeft:8}}>In-app notifications</span></label>
        </div>
      </section>

      <section className="card" aria-labelledby="preferences-heading">
        <h3 id="preferences-heading">Preferences</h3>
        <p className="muted small">Language, timezone and display preferences.</p>

        <div style={{display:'grid',gap:10,marginTop:12}}>
          <label className="input-label">Language</label>
          <div className="input-field">
            <select value={form.language} onChange={e=>updateField('language', e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="tl">Filipino</option>
            </select>
          </div>

          <label className="input-label">Timezone</label>
          <div className="input-field">
            <select value={form.timezone} onChange={e=>updateField('timezone', e.target.value)}>
              <option value="Asia/Manila">Asia/Manila</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="security-heading">
        <h3 id="security-heading">Security</h3>
        <p className="muted small">Manage two-factor authentication and active sessions.</p>

        <div style={{display:'grid',gap:12,marginTop:12}}>
          <label className="checkbox"><input type="checkbox" checked={form.twoFactor} onChange={e=>updateField('twoFactor', e.target.checked)} /> <span style={{marginLeft:8}}>Enable two-factor authentication</span></label>
          <div style={{display:'flex',gap:8}}>
            <button type="button" className="btn btn-light" onClick={()=>alert('Manage sessions not implemented')}>View active sessions</button>
            <button type="button" className="btn" onClick={()=>alert('Request account export not implemented')}>Request account export</button>
          </div>
        </div>
      </section>

      <div style={{display:'flex',gap:12,justifyContent:'flex-end',alignItems:'center'}}>
        {status && (
          <div style={{color: status.ok ? 'var(--green-800)' : '#c2410c', fontWeight:700}}>{status.message}</div>
        )}
        <button type="button" className="btn muted" onClick={()=>window.location.reload()}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      </div>
    </form>
  );
}
