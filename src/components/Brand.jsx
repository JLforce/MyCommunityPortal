import Link from 'next/link';

export default function Brand({ className = '', size = 'large', userRole }){
  const logoClass = size === 'small' ? 'brand-logo small' : 'brand-logo large';

  // Determine the dashboard URL based on the user's role
  let dashboardUrl = '/'; // Default to home/signin page if no role
  if (userRole) {
    const normRole = userRole.toLowerCase().replace(/\s+/g, '_');
    const isAdmin = normRole === 'city_official';
    
    if (isAdmin) {
      dashboardUrl = '/dashboard-admin';
    } else {
      dashboardUrl = '/dashboard';
    }
  }

  const BrandContent = () => (
    <>
      <div className={logoClass} aria-hidden style={{display:'inline-flex',alignItems:'center',justifyContent:'center',background:'#15803d',color:'#fff',fontWeight:700}}>
        {/* use emoji as fallback icon */}
        <span style={{fontSize:16}}>🌿</span>
      </div>
      <strong className="brand-text" style={{marginLeft:8}}>MyCommunityPortal</strong>
    </>
  );

  // If userRole is not yet defined, render a non-clickable span to prevent premature navigation.
  // Once userRole is available, render the proper Link.
  if (!userRole) {
    return <span className={`brand ${className}`.trim()}><BrandContent /></span>;
  }

  return (
    <Link href={dashboardUrl} className={`brand ${className}`.trim()}><BrandContent /></Link>
  );
}
