"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NotificationsModal from './NotificationsModal';
import LogoutConfirmModal from './LogoutConfirmModal';
import { supabase } from '@/lib/supabase';

const BellIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CogIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 015.28 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.4 6.6A2 2 0 017.23 3.77l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c.12.7.7 1.24 1.4 1.39h.24a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0120.72 6.1l-.06.06a1.65 1.65 0 00-.33 1.82v.24c.15.7.69 1.28 1.39 1.4H21a2 2 0 010 4h-.09c-.7.12-1.24.7-1.39 1.4v.24z" stroke="#374151" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogoutIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M16 17l5-5-5-5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h4" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HeaderButtons(){
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState(null);
  const ref = useRef();

  useEffect(()=>{
    function onResize(){
      setIsMobile(window.innerWidth < 720);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return ()=> window.removeEventListener('resize', onResize);
  },[]);

  useEffect(()=>{
    try{
      const stored = localStorage.getItem('mcp_avatar');
      if (stored) setAvatar(stored);
    }catch(e){ /* ignore in non-browser or privacy mode */ }
  },[]);

  useEffect(()=>{
    let mounted = true;
    async function fetchRole(){
      try{
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId){
          if (mounted) setRole(null);
          return;
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();
        if (mounted) setRole(profile?.role || null);
      }catch(err){
        if (mounted) setRole(null);
        console.error('HeaderButtons: failed to fetch role', err);
      }
    }
    fetchRole();
    return ()=>{ mounted = false; };
  },[]);

  const isAdminRole = useMemo(()=>{
    const norm = (role || '').toString().trim().toLowerCase().replace(/\s+/g,'_');
    if (!norm) return false;
    return norm.includes('admin') || norm.includes('official') || norm.includes('city_authority');
  },[role]);

  const navigateToNotifications = ()=>{
    const target = isAdminRole ? '/dashboard-admin/notification' : '/notifications';
    router.push(target);
  };

  useEffect(()=>{
    function onDoc(e){
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return ()=> document.removeEventListener('click', onDoc);
  },[]);

  return (
    <>
      <div ref={ref} style={{display:'flex',alignItems:'center',gap:12}}>
        {!isMobile ? (
          <>
          <Link
            href={isAdminRole ? "/dashboard-admin/settings" : "/settings"}
            title="Settings"
            aria-label="Settings"
            onMouseEnter={()=>setHovered('settings')}
            onMouseLeave={()=>setHovered(null)}
            style={{display:'inline-flex',background: hovered==='settings' ? 'rgba(0,0,0,0.04)' : 'transparent',border:'none',padding:8,borderRadius:10,alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'background .15s'}}
          >
            <CogIcon />
          </Link>

          <div style={{position:'relative'}}>
            <Link
              href={isAdminRole ? "/dashboard-admin/profile" : "/profile"}
              title="Profile"
              aria-label="Profile"
              onMouseEnter={()=>setHovered('profile')}
              onMouseLeave={()=>setHovered(null)}
              style={{display:'inline-flex',background: '#fff',border:'1px solid var(--border)',padding:6,borderRadius:999,alignItems:'center',justifyContent:'center',width:40,height:40,cursor:'pointer',boxShadow: hovered==='profile' ? '0 6px 18px rgba(0,0,0,0.06)' : 'none',transition:'box-shadow .12s, transform .08s'}}
            >
              {avatar ? (
                <img src={avatar} alt="Profile avatar" style={{display:'inline-block',width:30,height:30,objectFit:'cover',borderRadius:999,border:'3px solid #fff'}} />
              ) : (
                <img src="/avatar-default.svg" alt="Default avatar" style={{display:'inline-block',width:30,height:30,objectFit:'cover',borderRadius:999,border:'3px solid #fff'}} />
              )}
            </Link>
            <span aria-hidden style={{position:'absolute',right:2,top:2,transform:'translate(30%, -30%)',width:8,height:8,background:'#ef4444',borderRadius:999,border:'2px solid var(--green-50)'}}></span>
          </div>

          <button
            title="Log out"
            aria-label="Log out"
            onMouseEnter={()=>setHovered('logout')}
            onMouseLeave={()=>setHovered(null)}
            onClick={()=>setLogoutOpen(true)}
            style={{display:'inline-flex',alignItems:'center',justifyContent:'center',padding:8,borderRadius:10,cursor:'pointer',background:'transparent',border:'none',transition:'background .12s'}}
          >
            <LogoutIcon />
          </button>
        </>
      ) : (
        <div style={{position:'relative'}}>
          <button onClick={()=> setOpen(v=>!v)} aria-haspopup="true" aria-expanded={open} title="More" style={{background:'transparent',border:'1px solid var(--border)',padding:'6px 8px',borderRadius:8,display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
            {/* three dots */}
            <svg width="18" height="6" viewBox="0 0 18 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="3" cy="3" r="2" fill="#374151" />
              <circle cx="9" cy="3" r="2" fill="#374151" />
              <circle cx="15" cy="3" r="2" fill="#374151" />
            </svg>
          </button>

          {open && (
            <div role="menu" aria-label="Header actions" style={{position:'absolute',right:0,top:'calc(100% + 8px)',background:'#fff',boxShadow:'0 6px 20px rgba(15,23,42,0.08)',borderRadius:8,padding:8,minWidth:180,zIndex:40}}>
              <Link href={isAdminRole ? "/dashboard-admin/settings" : "/settings"} role="menuitem" onClick={()=>setOpen(false)} style={{display:'flex',gap:10,alignItems:'center',padding:8,borderRadius:6,color:'var(--text-900)'}}>
                <CogIcon />
                <span>Settings</span>
              </Link>

              <Link href={isAdminRole ? "/dashboard-admin/profile" : "/profile"} role="menuitem" onClick={()=>setOpen(false)} style={{display:'flex',gap:10,alignItems:'center',padding:8,borderRadius:6,color:'var(--text-900)'}}>
                <UserIcon />
                <span>Profile</span>
              </Link>

              <button role="menuitem" onClick={()=>{ setOpen(false); setLogoutOpen(true); }} style={{display:'flex',gap:10,alignItems:'center',padding:8,borderRadius:6,color:'#ef4444',background:'transparent',border:'none',width:'100%',textAlign:'left',cursor:'pointer'}}>
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
      </div>
      
      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
      {/* Logout confirmation */}
      <LogoutConfirmModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}
