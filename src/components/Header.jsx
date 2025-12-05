import Link from 'next/link';
import Brand from './Brand';

export default function Header(){
  return (
    <header className="navbar">
      <div className="container nav-inner center" style={{justifyContent:'space-between'}}>
        <Brand />
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#community">Community</a>
        </nav>
        <div className="nav-cta" style={{display: 'flex', gap: 12, alignItems: 'center'}}>
          <Link aria-label="Sign in as City Official" className="cta-pill green" href="/admin-signin">Sign In as City Official</Link>
          <Link aria-label="Sign in as Resident" className="cta-pill green" href="/signin">Sign In as Resident</Link>
        </div>
      </div>
    </header>
  );
}


