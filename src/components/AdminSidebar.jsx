"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabase';
import Brand from './Brand';

const DashboardIcon = ({width=16,height=16}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#2563eb" strokeWidth="1.4" fill="none" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#2563eb" strokeWidth="1.4" fill="none" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#2563eb" strokeWidth="1.4" fill="none" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="#2563eb" strokeWidth="1.4" fill="none" />
  </svg>
);

const ReportsIcon = ({width=16,height=16}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M7 3h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3z" fill="#FFEDD5" stroke="#fb923c" strokeWidth="1.2" />
    <rect x="9" y="8" width="6" height="1.6" rx="0.8" fill="#b45309" />
  </svg>
);

const PickupsIcon = ({width=16,height=16}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 13h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z" fill="#CCFBF1" stroke="#0ea5a4" strokeWidth="1.2" />
    <path d="M7 7h10v4H7z" fill="#ffffff" opacity="0.95" stroke="#0ea5a4" strokeWidth="1.2" />
    <circle cx="8.5" cy="16" r="1" fill="#0f172a" />
    <circle cx="15.5" cy="16" r="1" fill="#0f172a" />
  </svg>
);

const UsersIcon = ({width=16,height=16}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="8" r="3" stroke="#374151" strokeWidth="1.4" fill="none" />
    <path d="M4 19c1.5-4 7-4 8-4s6.5 0 8 4v1H4v-1z" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function AdminSidebar() {
  const pathname = usePathname() || '/dashboard-admin';
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadRole(){
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId){ if (mounted){ setRole(null); setRoleLoading(false); } return; }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      if (mounted){ setRole(profile?.role || null); setRoleLoading(false); }
    }
    loadRole();
    return ()=> { mounted = false; };
  }, []);

  const isActive = (href) => {
    if (href === '/dashboard-admin') return pathname === '/dashboard-admin' || pathname === '/dashboard-admin/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Admin Navigation">
     {/* <div className="sidebar-brand">
        <Brand size="small" userRole={role} />
      </div>*/}

      <nav>
        <Link 
          href="/dashboard-admin" 
          className={`nav-link ${isActive('/dashboard-admin') ? 'active' : ''}`}
          aria-current={isActive('/dashboard-admin') ? 'page' : undefined}
        >
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="icon-box" aria-hidden>
              <DashboardIcon width={16} height={16} />
            </span>
            <span>Dashboard</span>
          </div>
        </Link>

        <Link 
          href="/dashboard-admin/reports" 
          className={`nav-link ${isActive('/dashboard-admin/reports') ? 'active' : ''}`}
        >
          <span className="icon-box" aria-hidden>
            <ReportsIcon width={16} height={16} />
          </span>
          <span>Reports</span>
        </Link>

        <Link 
          href="/dashboard-admin/pickups" 
          className={`nav-link ${isActive('/dashboard-admin/pickups') ? 'active' : ''}`}
        >
          <span className="icon-box" aria-hidden>
            <PickupsIcon width={16} height={16} />
          </span>
          <span>Pickups</span>
        </Link>

        <Link 
          href="/dashboard-admin/users" 
          className={`nav-link ${isActive('/dashboard-admin/users') ? 'active' : ''}`}
        >
          <span className="icon-box" aria-hidden>
            <UsersIcon width={16} height={16} />
          </span>
          <span>Users</span>
        </Link>
      </nav>
    </aside>
  );
}
