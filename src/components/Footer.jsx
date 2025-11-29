import Link from 'next/link';
import Brand from './Brand';

export default function Footer(){
  return (
    <footer className="footer">
      <div className="container">
        <div className="cta center" style={{borderRadius:12,marginTop:-20}}>
          <div className="container" style={{textAlign:'center'}}>
            <h2 style={{margin:'0 0 8px'}}>Ready to Transform Your Community?</h2>
            <p className="small" style={{color:'#e7f7ea'}}>Join thousands of residents and local authorities.</p>
            <div className="cta-actions">
              <Link className="btn btn-light" href="/signup">Get Started Today</Link>
              <Link className="btn" href="/contact-sales">Contact Sales</Link>
            </div>
          </div>
        </div>

        <div className="footer-grid" style={{marginTop:24}}>
          <div className="footer-brand">
            <div className="brand-row">
              <Brand size="large" />
            </div>
            <p className="small footer-tagline">Connecting communities for better waste management and civic engagement.</p>
          </div>
          <div>
            <h5>Features</h5>
            <p className="small">Pickup Scheduling<br/>Issue Reporting<br/>Waste Guide<br/>Analytics</p>
          </div>
          <div>
            <h5>Support</h5>
            <p className="small">Help Center<br/>Contact Us<br/>Community Forum<br/>Status Page</p>
          </div>
          <div>
            <h5>Legal</h5>
            <p className="small">Privacy Policy<br/>Terms of Service<br/>Cookie Policy<br/>Accessibility</p>
          </div>
        </div>
        <p className="small" style={{marginTop:18,textAlign:'center'}}>© 2025 MyCommunityPortal. All rights reserved.</p>
      </div>
    </footer>
  );
}


