import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function HomePage(){
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container" style={{textAlign:'center'}}>
            <span className="badge">🌿 Connecting Communities</span>
            <h1>Waste & Issue<br/>Management System</h1>
            <p className="lead">A centralized platform connecting residents and local authorities for better waste collection, community issue reporting, and transparent governance.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#get-started">Join Your Community →</a>
              <a className="btn" href="#learn">Learn More</a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section">
          <div className="container">
            <h2>Everything You Need for Community Management</h2>
            <p className="section-lead">Comprehensive tools to streamline waste management and community engagement</p>
            <div className="grid">
              <div className="card">
                <div className="brand" style={{gap:8}}><span className="badge" style={{padding:'6px 8px'}}>📅</span><strong>Pickup Scheduling</strong></div>
                <p>Schedule regular and special garbage pickups with real‑time tracking and notifications</p>
                <ul>
                  <li>Regular pickup scheduling</li>
                  <li>Special request handling</li>
                  <li>Status tracking & notifications</li>
                </ul>
              </div>
              <div className="card">
                <div className="brand" style={{gap:8}}><span className="badge" style={{padding:'6px 8px'}}>📸</span><strong>Issue Reporting</strong></div>
                <p>Report illegal dumping, missed collections, and problems with photo uploads</p>
                <ul>
                  <li>Photo & location tagging</li>
                  <li>Real‑time status updates</li>
                  <li>Community problem tracking</li>
                </ul>
              </div>
              <div className="card">
                <div className="brand" style={{gap:8}}><span className="badge" style={{padding:'6px 8px'}}>♻️</span><strong>Waste Segregation Guide</strong></div>
                <p>Simple guides on proper waste segregation with local rules and search</p>
                <ul>
                  <li>Waste category guides</li>
                  <li>Local regulations</li>
                  <li>Smart search function</li>
                </ul>
              </div>

              <div className="card">
                <div className="brand" style={{gap:8}}><span className="badge" style={{padding:'6px 8px'}}>📊</span><strong>Analytics Dashboard</strong></div>
                <p>Comprehensive insights for local authorities on waste collection and trends</p>
                <ul>
                  <li>Collection performance metrics</li>
                  <li>Recyclables recovery data</li>
                  <li>Community trend analysis</li>
                </ul>
              </div>
              <div className="card">
                <div className="brand" style={{gap:8}}><span className="badge" style={{padding:'6px 8px'}}>🤖</span><strong>AI Chatbot Support</strong></div>
                <p>24/7 automated assistance for residents’ queries and waste guidance</p>
                <ul>
                  <li>24/7 availability</li>
                  <li>Instant query resolution</li>
                  <li>Waste management guidance</li>
                </ul>
              </div>
              <div className="card">
                <div className="brand" style={{gap:8}}><span className="badge" style={{padding:'6px 8px'}}>📍</span><strong>Location Services</strong></div>
                <p>GPS‑enabled tagging and mapping for accurate service delivery</p>
                <ul>
                  <li>Auto location tagging</li>
                  <li>Interactive maps</li>
                  <li>Service area coverage</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how" className="section steps">
          <div className="container">
            <h2>How It Works</h2>
            <p className="section-lead">Get started in three simple steps</p>
            <div className="steps-grid">
              <div className="step">
                <div className="icon">👤</div>
                <h4>1. Create Account</h4>
                <p className="small muted">Sign up with your community credentials and verify your address</p>
              </div>
              <div className="step">
                <div className="icon">💬</div>
                <h4>2. Report & Schedule</h4>
                <p className="small muted">Schedule pickups, report issues, and access resources</p>
              </div>
              <div className="step">
                <div className="icon">🛡️</div>
                <h4>3. Track Progress</h4>
                <p className="small muted">Monitor requests, receive updates, and contribute to a cleaner community</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section id="community" className="section">
          <div className="container impact">
            <div>
              <span className="badge">💚 Real Impact</span>
              <h2 style={{margin:'10px 0 6px'}}>Building Stronger, Cleaner Communities</h2>
              <p className="muted">MyCommunityPortal promotes transparency, improves communication, and ensures timely service delivery while fostering responsible community participation.</p>
              <div className="impact-points" style={{marginTop:12}}>
                <div className="point"><span className="tick">✅</span><div><strong>Improved Response Times</strong><p className="small muted">Faster resolution through direct communication channels</p></div></div>
                <div className="point"><span className="tick">✅</span><div><strong>Data‑Driven Decisions</strong><p className="small muted">Analytics help optimize resource allocation</p></div></div>
                <div className="point"><span className="tick">✅</span><div><strong>Increased Transparency</strong><p className="small muted">Real‑time tracking builds trust</p></div></div>
                <div className="point"><span className="tick">✅</span><div><strong>Environmental Impact</strong><p className="small muted">Better segregation improves recycling rates</p></div></div>
              </div>
            </div>
            <div>
              <Image
                className="impact-img"
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
                alt="Neighbors volunteering in a community cleanup at a local park"
                width={1600}
                height={1067}
                priority
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}


