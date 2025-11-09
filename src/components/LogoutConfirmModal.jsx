"use client";
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }){
	const router = useRouter();
	const ref = useRef();

	useEffect(()=>{
		function onKey(e){
			if (e.key === 'Escape' && isOpen) onClose();
		}
		document.addEventListener('keydown', onKey);
		return ()=> document.removeEventListener('keydown', onKey);
	},[isOpen,onClose]);

	useEffect(()=>{
		if (isOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = 'unset';
		return ()=> { document.body.style.overflow = 'unset'; };
	},[isOpen]);

	if (!isOpen) return null;

	function handleConfirm(){
		if (onConfirm) onConfirm();
		// navigate to logout route
		try{ router.push('/logout'); }catch(e){ window.location.href = '/logout'; }
	}

	return (
		<div
			role="dialog"
			aria-modal="true"
			style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.45)',zIndex:1200,padding:20}}
			onClick={onClose}
		>
			<div
				ref={ref}
				onClick={e=>e.stopPropagation()}
				style={{background:'#fff',borderRadius:14,width:'100%',maxWidth:520,boxShadow:'0 24px 60px rgba(2,6,23,0.2)',overflow:'hidden',display:'flex',flexDirection:'column'}}
			>
				<div style={{padding:'20px 20px 12px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
								<div>
									<h3 style={{margin:0,fontSize:24,lineHeight:1.05,fontWeight:800,color:'var(--text-700)',marginBottom:6}}>Confirm sign out</h3>
									<p className="muted" style={{marginTop:6,marginBottom:0,fontSize:14,color:'var(--text-600)'}}>Are you sure you want to sign out? You will need to sign in again to access your account.</p>
								</div>
					<button onClick={onClose} aria-label="Close" style={{background:'transparent',border:'none',padding:8,cursor:'pointer'}}>✕</button>
				</div>

				<div style={{padding:20,display:'flex',gap:12,justifyContent:'flex-end'}}>
					<button className="btn muted" onClick={onClose} style={{padding:'10px 14px'}}>Cancel</button>
					<button className="btn btn-primary" onClick={handleConfirm} style={{padding:'10px 14px'}}>Sign out</button>
				</div>
			</div>
		</div>
	);
}
