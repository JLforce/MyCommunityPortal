import Link from 'next/link';
import Brand from '../../components/Brand';
import { signIn } from '../actions/auth';

export const metadata = {
  title: 'Sign in – MyCommunityPortal',
};

export default function SignInPage(){
  return (
    <main>
      <div className="auth-topbar">
        <div className="container auth-topbar-inner">
          <Brand />
          <div className="small">Don't have an account? <Link href="/signup">Sign up</Link></div>
        </div>
      </div>

      <section className="auth-wrap">
        <div className="container">
          <div className="auth-head">
            <h1>Welcome Back</h1>
            <p className="muted">Sign in to your account to continue managing your community</p>
          </div>

          <div className="auth-card">
            <div>
              <h3 style={{margin:'0 0 6px'}}>Sign In</h3>
              <p className="small muted" style={{margin:0}}>Enter your credentials to access your MyCommunityPortal account</p>
            </div>

            <form className="auth-form" action={signIn}>
              <label className="input-label" htmlFor="email">Email Address</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/mail.svg" alt="" />
                <input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
              </div>

              <div className="input-row">
                <label className="input-label" htmlFor="password">Password</label>
                <Link className="small" href="/forgot-password">Forgot password?</Link>
              </div>
              <div className="input-field">
                <img className="input-icon" src="/icons/lock.svg" alt="" />
                <input id="password" name="password" type="password" placeholder="Enter your password" required />
              </div>

              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              <button className="btn btn-primary btn-block" type="submit">
                <span>Sign In</span>
                <span aria-hidden>→</span>
              </button>

              <div className="or">OR CONTINUE WITH</div>

              <div className="social-row">
                <a className="btn social" href="/continue/google"><img src="/icons/google.svg" alt="" style={{width:18,height:18}} /> Google</a>
                <a className="btn social" href="/continue/facebook"><img src="/icons/facebook.svg" alt="" style={{width:18,height:18}} /> Facebook</a>
              </div>

              <div className="small center" style={{marginTop:10}}>Don't have an account? <Link href="/signup"> Sign up for free</Link></div>
            </form>
          </div>

          <div className="auth-help">
            <a className="small" href="/help-center">Help Center</a>
            <a className="small" href="/contact-support">Contact Support</a>
          </div>
        </div>
      </section>
    </main>
  );
}


