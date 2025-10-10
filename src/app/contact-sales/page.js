
export const metadata = { title: 'Contact Sales – MyCommunityPortal' };

export default function ContactSales() {
  return (
    <main className="section" style={{paddingTop: 0}}>
      {/* Hero Section */}
      <div
        className="fade-in"
        style={{
          background: 'linear-gradient(90deg, #EAF7ED 0%, #F1FAF5 100%)',
          padding: '48px 0 32px',
          borderRadius: '0 0 32px 32px',
          marginBottom: 32,
          boxShadow: '0 4px 24px 0 rgba(22,101,52,0.06)'
        }}
      >
        <div className="container" style={{textAlign: 'center'}}>
          <div style={{fontSize: 48, marginBottom: 12, animation: 'fadeInUp 1.2s'}}>🤝</div>
          <h1 style={{fontSize: 36, margin: 0, fontWeight: 800, color: 'var(--green-900)'}}>Contact Sales</h1>
          <p className="section-lead" style={{margin: '12px auto 0', maxWidth: 540}}>
            Ready to transform your community? Let's discuss how MyCommunityPortal can help your local government or organization.
          </p>
        </div>
      </div>

      <div className="container support">
        <div className="support-grid">
          {/* Left: Form Card */}
          <div className="support-card fade-in" style={{boxShadow: '0 2px 16px 0 rgba(22,101,52,0.07)', animationDelay: '0.2s', animationFillMode: 'both'}}>
            <h3 style={{fontWeight: 700, color: 'var(--green-900)', marginBottom: 8}}>Schedule a Demo</h3>
            <form className="support-form">
              <div className="row">
                <div className="input-field"><input type="text" placeholder="First name" /></div>
                <div className="input-field"><input type="text" placeholder="Last name" /></div>
              </div>
              <div className="row">
                <div className="input-field"><input type="email" placeholder="Email address" /></div>
                <div className="input-field"><input type="tel" placeholder="Phone number" /></div>
              </div>
              <div className="input-field"><select>
                <option value="">Select your organization type</option>
                <option value="city">City Government</option>
                <option value="county">County Government</option>
                <option value="municipality">Municipality</option>
                <option value="waste-management">Waste Management Company</option>
                <option value="other">Other</option>
              </select></div>
              <div className="input-field"><input type="text" placeholder="Organization name" /></div>
              <textarea placeholder="Tell us about your community's needs and current challenges..." />
              <button className="btn btn-primary btn-block" type="submit" style={{marginTop: 8, fontSize: 16, padding: '14px 0'}}>Schedule Demo</button>
            </form>
          </div>

          {/* Right: Features Card */}
          <div className="support-card slide-in" style={{background: 'var(--green-50)', boxShadow: '0 2px 16px 0 rgba(22,101,52,0.04)', animationDelay: '0.4s', animationFillMode: 'both'}}>
            <h3 style={{fontWeight: 700, color: 'var(--green-900)', marginBottom: 18}}>Why Choose MyCommunityPortal?</h3>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              <li style={{display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18}}>
                <span style={{fontSize: 22}}>📊</span>
                <div>
                  <strong>Comprehensive Analytics</strong>
                  <p className="small" style={{margin: 0}}>Track waste collection efficiency, community engagement, and service delivery metrics in real-time.</p>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18}}>
                <span style={{fontSize: 22}}>🤖</span>
                <div>
                  <strong>AI-Powered Support</strong>
                  <p className="small" style={{margin: 0}}>24/7 automated assistance for residents, reducing support workload and improving response times.</p>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18}}>
                <span style={{fontSize: 22}}>📍</span>
                <div>
                  <strong>Smart Location Services</strong>
                  <p className="small" style={{margin: 0}}>GPS-enabled tagging and mapping for accurate service delivery and route optimization.</p>
                </div>
              </li>
              <li style={{display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18}}>
                <span style={{fontSize: 22}}>🔄</span>
                <div>
                  <strong>Seamless Integration</strong>
                  <p className="small" style={{margin: 0}}>Easy integration with existing municipal systems and workflows.</p>
                </div>
              </li>
            </ul>

            <div style={{marginTop: 32}}>
              <h4 style={{margin: '0 0 8px', color: 'var(--green-800)'}}>Get in Touch</h4>
              <p className="small" style={{margin: 0}}>📧 <b>Email:</b> sales@mycommunityportal.example</p>
              <p className="small" style={{margin: 0}}>📞 <b>Phone:</b> (555) 123-4567</p>
              <p className="small" style={{margin: 0}}>📅 <b>Schedule:</b> <a href="#calendar">Book a Demo</a></p>
              <p className="small" style={{margin: 0}}>💸 <b>Pricing:</b> <a href="#pricing">View Plans</a></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

