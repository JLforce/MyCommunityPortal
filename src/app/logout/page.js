"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage(){
  const router = useRouter();

  useEffect(()=>{
    // Placeholder logout flow: redirect to sign-in page after clearing client state
    // If you have auth, clear tokens or call sign-out endpoint here.
    const t = setTimeout(()=> router.push('/signin'), 700);
    return ()=> clearTimeout(t);
  },[router]);

  return (
    <div className="container" style={{padding:'48px 0',minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
      <h2>Signing out…</h2>
      <p className="muted">You will be redirected to the sign-in page.</p>
    </div>
  );
}
