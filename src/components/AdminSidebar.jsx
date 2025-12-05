"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname() || '/dashboard-admin';
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const items = [
    { key: 'dashboard', href: '/dashboard-admin', label: 'Dashboard', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" fill="#ffffff" />
        <rect x="14" y="3" width="7" height="7" rx="1" fill="#ffffff" />
        <rect x="3" y="14" width="7" height="7" rx="1" fill="#ffffff" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="#ffffff" />
      </svg>
    )},
    { key: 'reports', href: '/dashboard-admin/reports', label: 'Reports', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3z" fill="#c2410c" />
        <rect x="9" y="8" width="6" height="1.6" rx="0.8" fill="#fff" opacity="0.9" />
      </svg>
    )},
    { key: 'pickups', href: '/dashboard-admin/pickups', label: 'Pickups', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 13h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z" fill="#0ea5a4" />
        <path d="M7 7h10v4H7z" fill="#ffffff" opacity="0.95" />
        <circle cx="8.5" cy="16" r="1" fill="#0f172a" />
        <circle cx="15.5" cy="16" r="1" fill="#0f172a" />
      </svg>
    )},
    { key: 'users', href: '/dashboard-admin/users', label: 'Users', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3" fill="#0f172a" />
        <path d="M4 19c1.5-4 7-4 8-4s6.5 0 8 4v1H4v-1z" fill="#0f172a" />
      </svg>
    )}
  ];

  const isActive = (href) => {
    if (href === '/dashboard-admin') return pathname === '/dashboard-admin' || pathname === '/dashboard-admin/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14,marginTop:4}}>
      {items.map(item => {
        const activeClass = isActive(item.href) || active === item.href;

        const tileStyle = (() => {
          const base = { width:44, height:44, display:'grid', placeItems:'center', borderRadius:10 };
          // 3D-like gradients and shadows per icon
          if (item.key === 'dashboard') {
            return {
              ...base,
              background: activeClass ? 'linear-gradient(180deg,#0b6b39,#0a5a31)' : 'linear-gradient(180deg,#e6f7ee,#dff6eb)',
              boxShadow: activeClass ? '0 8px 18px rgba(6,95,46,0.25), inset 0 2px 0 rgba(255,255,255,0.06)' : '0 6px 18px rgba(6,95,46,0.06), inset 0 6px 12px rgba(255,255,255,0.8)'
            };
          }
          if (item.key === 'reports') {
            return {
              ...base,
              background: activeClass ? 'linear-gradient(180deg,#f2d9cf,#e9c6b8)' : 'linear-gradient(180deg,#fff7f3,#fff3ef)',
              boxShadow: activeClass ? '0 8px 18px rgba(194,65,12,0.18), inset 0 2px 0 rgba(255,255,255,0.06)' : '0 6px 18px rgba(194,65,12,0.06), inset 0 6px 12px rgba(255,255,255,0.85)'
            };
          }
          if (item.key === 'pickups') {
            return {
              ...base,
              background: activeClass ? 'linear-gradient(180deg,#ccfbf1,#99f0e7)' : 'linear-gradient(180deg,#f0fffe,#e8fffc)',
              boxShadow: activeClass ? '0 8px 18px rgba(14,165,164,0.18), inset 0 2px 0 rgba(255,255,255,0.06)' : '0 6px 18px rgba(14,165,164,0.06), inset 0 6px 12px rgba(255,255,255,0.85)'
            };
          }
          // users
          return {
            ...base,
            background: activeClass ? 'linear-gradient(180deg,#eef3ff,#e6ecff)' : 'linear-gradient(180deg,#f7f9fb,#f2f5f8)',
            boxShadow: activeClass ? '0 8px 18px rgba(15,23,42,0.12), inset 0 2px 0 rgba(255,255,255,0.06)' : '0 6px 18px rgba(15,23,42,0.04), inset 0 6px 12px rgba(255,255,255,0.85)'
          };
        })();

        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => setActive(item.href)}
            className={"nav-link"}
            style={{
              display:'flex',
              alignItems:'center',
              gap:12,
              padding: activeClass ? '14px 20px' : '12px 16px',
              borderRadius:10,
              background: activeClass ? 'var(--green-900)' : 'transparent',
              color: activeClass ? '#fff' : undefined,
              fontSize: activeClass ? 18 : 17,
              fontWeight: activeClass ? 800 : 600,
              boxShadow: activeClass ? '0 8px 24px rgba(16,24,40,0.08)' : 'none',
              transform: activeClass ? 'translateY(-2px)' : 'none',
              transition: 'all 160ms ease'
            }}
          >
            <div style={tileStyle}>
              {item.icon}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
