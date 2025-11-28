import Link from 'next/link';

export default function Brand({ className = '' }){
  return (
    <Link href="/dashboard" className={`brand ${className}`.trim()}>
      <span style={{display:'inline-flex',width:28,height:28,alignItems:'center',justifyContent:'center',borderRadius:8,background:'#15803d',color:'#fff',fontWeight:700}}>🌿</span>
      <span style={{marginLeft:8}}>MyCommunityPortal</span>
    </Link>
  );
}
