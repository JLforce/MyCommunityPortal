"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/supabase';

const Icon = ({ type }) => {
  if (type === 'report') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="1.6" />
        <path d="M12 8v5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'success') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="1.6" />
        <path d="M9 12.5l1.8 1.8L15 11" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 5v7" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1" fill="#f59e0b" />
    </svg>
  );
};

export default function NotificationPanel({ initialNotifications = [] }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  async function removeNotification(id) {
    setNotifications((prev) => prev.filter(n => n.id !== id));
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  async function markAllRead() {
    setNotifications([]);
    try {
      const ids = notifications.map(n => n.id);
      if (ids.length > 0) {
        await supabase.from('notifications').update({ is_read: true }).in('id', ids);
      }
    } catch (error) {
      console.error('Error marking notifications read:', error);
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(2,6,23,0.35)',zIndex:1200,padding:20}}
      onClick={() => router.back()}
    >
      <div style={{maxWidth:840,width:'100%'}} onClick={(e)=>e.stopPropagation()}>
        <div style={{background:'#fff',borderRadius:12,boxShadow:'0 6px 24px rgba(2,6,23,0.06)',overflow:'hidden'}}>
          <div style={{padding:'18px 20px',borderBottom:'1px solid #F3F4F6',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <h2 style={{margin:0,fontSize:34,fontWeight:800,color:'#0f172a',lineHeight:1}}>
                Notifications
              </h2>
              <p style={{margin:0,fontSize:14,color:'#6b7280',marginTop:6}}>Recent activity and updates</p>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button onClick={markAllRead} style={{background:'transparent',border:'none',padding:8,borderRadius:8,cursor:'pointer'}} title="Mark all as read">Mark all read</button>
              <button onClick={() => router.back()} title="Close" style={{background:'transparent',border:'none',padding:8,borderRadius:8,cursor:'pointer'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div style={{maxHeight:'70vh',overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:12}}>
            {notifications.length === 0 ? (
              <div style={{padding:36,textAlign:'center',borderRadius:10,border:'1px dashed #E5E7EB',background:'#FAFAFA'}}>
                <p style={{margin:0,color:'#6b7280'}}>No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{display:'flex',alignItems:'flex-start',gap:12,padding:16,borderRadius:10,background:'#fff',border:'1px solid #F1F5F9'}}>
                  <div style={{width:44,height:44,display:'grid',placeItems:'center',borderRadius:10,background:'#F9FAFB',flex:'0 0 44px'}}>
                    <Icon type={n.type} />
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                      <div>
                        <strong style={{display:'block',fontSize:15,color:'#0f172a'}}>{n.title}</strong>
                        <div style={{fontSize:13,color:'#6b7280',marginTop:6}}>{n.message}</div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                        <span style={{fontSize:12,color:'#9CA3AF'}}>{formatTime(n.created_at) || n.time}</span>
                        <button onClick={() => removeNotification(n.id)} title="Delete" style={{background:'transparent',border:'none',cursor:'pointer',color:'#9CA3AF'}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M3 6h18" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11v6M14 11v6" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
