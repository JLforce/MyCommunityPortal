"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/supabase';

export default function LogoutPage(){
  const router = useRouter();

  useEffect(()=>{
    let cancelled = false;
    async function doLogout(){
      try{
        // Clear browser session
        await supabase.auth.signOut();
      }catch(err){
        console.error('Client signOut failed', err);
      }
      try{
        // Clear server cookies/session
        await fetch('/api/auth/logout', { method: 'POST' });
      }catch(err){
        console.error('Server logout call failed', err);
      }
      if (!cancelled){
        router.replace('/signin');
      }
    }
    doLogout();
    return ()=>{ cancelled = true; };
  },[router]);

  return (
    <div className="container" style={{padding:'48px 0',minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <h2>Signing out…</h2>
      <p className="muted">You will be redirected to the home page.</p>
    </div>
  );
}
