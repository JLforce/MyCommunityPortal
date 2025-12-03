import Link from 'next/link';

export default function Brand({ className = '', size = 'large', userRole }){
  const logoClass = size === 'small' ? 'brand-logo small' : 'brand-logo large';

  // Determine the dashboard URL based on the user's role
  const normRole = (userRole || '').toLowerCase();
  const isAdmin = normRole.includes('admin') || normRole.includes('official');
  const dashboardUrl = isAdmin ? '/dashboard-admin' : '/dashboard';

  return (
    // Use the dynamic URL for the Link
    <Link href={dashboardUrl} className={`brand ${className}`.trim()}>
      <div className={logoClass} aria-hidden style={{display:'inline-flex',alignItems:'center',justifyContent:'center',background:'#15803d',color:'#fff',fontWeight:700}}>
        {/* use emoji as fallback icon */}
        <span style={{fontSize:16}}>🌿</span>
      </div>
      <strong className="brand-text" style={{marginLeft:8}}>MyCommunityPortal</strong>
    </Link>
  );
}
