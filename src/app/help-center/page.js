export const metadata = { title: 'Help Center – MyCommunityPortal' };

export default function HelpCenter(){
  return (
    <main className="section">
      <div className="container faq">
        <h2>Help Center</h2>
        <p className="section-lead">Frequently asked questions about accounts, sign in, and using the portal.</p>

        <div className="accordion" role="list">
          <details className="accordion-item" open>
            <summary className="accordion-summary">
              <span className="accordion-title">How do I create an account?</span>
              <span>+</span>
            </summary>
            <div className="accordion-content">
              Go to the Sign Up page, fill in your details, agree to the terms, and click Create Account.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-summary">
              <span className="accordion-title">I forgot my password. What should I do?</span>
              <span>+</span>
            </summary>
            <div className="accordion-content">
              Use the Forgot Password link on the Sign In page and enter your email to receive a reset link.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-summary">
              <span className="accordion-title">Which browsers do you support?</span>
              <span>+</span>
            </summary>
            <div className="accordion-content">
              The portal supports the latest versions of Chrome, Edge, Firefox, and Safari.
            </div>
          </details>

          <details className="accordion-item">
            <summary className="accordion-summary">
              <span className="accordion-title">How do I report an issue?</span>
              <span>+</span>
            </summary>
            <div className="accordion-content">
              From your dashboard, click Report Issue, add a description and optional photo, and submit.
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}


