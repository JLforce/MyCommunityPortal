export default function Header(){
  return (
    <header className="navbar">
      <div className="container nav-inner center" style={{justifyContent:'space-between'}}>
        <div className="brand">
          <span style={{display:'inline-flex',width:28,height:28,alignItems:'center',justifyContent:'center',borderRadius:8,background:'#15803d',color:'#fff',fontWeight:700}}>🌿</span>
          <span>MyCommunityPortal</span>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#community">Community</a>
        </nav>
        <div className="nav-cta">
          <a className="btn" href="#signin">Sign In</a>
          <a className="btn btn-primary" href="#get-started">Get Started</a>
        </div>
      </div>
    </header>
  );
}


