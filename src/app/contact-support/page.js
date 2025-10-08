export const metadata = { title: 'Contact Support – MyCommunityPortal' };

export default function ContactSupport(){
  return (
    <main className="section">
      <div className="container support">
        <h2 style={{textAlign:'center',margin:'0 0 8px'}}>Contact Support</h2>
        <p className="section-lead">Reach out to our team. We typically respond within 1–2 business days.</p>

        <div className="support-grid">
          <div className="support-card">
            <h3>Send us a message</h3>
            <form className="support-form">
              <div className="row">
                <div className="input-field"><input type="text" placeholder="First name" /></div>
                <div className="input-field"><input type="text" placeholder="Last name" /></div>
              </div>
              <div className="row">
                <div className="input-field"><input type="email" placeholder="Email address" /></div>
                <div className="input-field"><input type="tel" placeholder="Phone (optional)" /></div>
              </div>
              <textarea placeholder="How can we help? Provide details here." />
              <button className="btn btn-primary" type="submit">Send message</button>
            </form>
          </div>

          <div className="support-card">
            <h3>Other ways to reach us</h3>
            <p className="small">• Email: support@mycommunityportal.example</p>
            <p className="small">• Knowledge base: See our <a href="/help-center">Help Center</a></p>
            <p className="small">• Status: <a href="#status">Status Page</a></p>
            <p className="small">• Community: <a href="#forum">Community Forum</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}


