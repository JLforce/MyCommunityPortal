import Link from 'next/link';

export const metadata = { title: 'Forgot password – MyCommunityPortal' };

export default function ForgotPasswordPage(){
  return (
    <main>
      <div className="auth-topbar">
        <div className="container auth-topbar-inner">
          <div className="brand">
            <span style={{display:'inline-flex',width:24,height:24,alignItems:'center',justifyContent:'center',borderRadius:6,background:'#15803d',color:'#fff',fontWeight:700}}>🌿</span>
            <span>MyCommunityPortal</span>
          </div>
          <div className="small">Remembered your password? <Link href="/signin">Sign in</Link></div>
        </div>
      </div>

      <section className="auth-wrap">
        <div className="container">
          <div className="auth-head">
            <h1>Reset your password</h1>
            <p className="muted">Enter the email associated with your account and we will send you a password reset link.</p>
          </div>

          <div className="auth-card">
            <div>
              <h3 style={{margin:'0 0 6px'}}>Forgot Password</h3>
              <p className="small muted" style={{margin:0}}>We'll send an email with instructions to reset your password.</p>
            </div>

            <form className="auth-form">
              <label className="input-label" htmlFor="email">Email Address</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/mail.svg" alt="" />
                <input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
              </div>

              <button className="btn btn-primary btn-block" type="submit">Send reset link</button>

              <div className="small center" style={{marginTop:10}}>Back to <Link href="/signin">Sign in</Link></div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}


