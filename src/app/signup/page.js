import Link from 'next/link';

export const metadata = { title: 'Sign up – MyCommunityPortal' };

export default function SignUpPage(){
  return (
    <main>
      <div className="auth-topbar">
        <div className="container auth-topbar-inner">
          <div className="brand">
            <span style={{display:'inline-flex',width:24,height:24,alignItems:'center',justifyContent:'center',borderRadius:6,background:'#15803d',color:'#fff',fontWeight:700}}>🌿</span>
            <span>MyCommunityPortal</span>
          </div>
          <div className="small">Already have an account? <Link href="/signin">Sign in</Link></div>
        </div>
      </div>

      <section className="auth-wrap">
        <div className="container">
          <div className="auth-head">
            <h1>Join Your Community</h1>
            <p className="muted">Create your account to start managing waste and reporting issues</p>
          </div>

          <div className="auth-card">
            <div>
              <h3 style={{margin:'0 0 6px'}}>Create Account</h3>
              <p className="small muted" style={{margin:0}}>Fill in your details to get started with MyCommunityPortal</p>
            </div>

            <form className="auth-form">
              <div className="form-row">
                <div>
                  <label className="input-label" htmlFor="firstName">First Name</label>
                  <div className="input-field">
                    <img className="input-icon" src="/icons/user.svg" alt="" />
                    <input id="firstName" type="text" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="lastName">Last Name</label>
                  <div className="input-field">
                    <img className="input-icon" src="/icons/user.svg" alt="" />
                    <input id="lastName" type="text" placeholder="Doe" />
                  </div>
                </div>
              </div>

              <label className="input-label" htmlFor="email">Email Address</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/mail.svg" alt="" />
                <input id="email" type="email" placeholder="john.doe@example.com" />
              </div>

              <label className="input-label" htmlFor="phone">Phone Number</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/phone.svg" alt="" />
                <input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <label className="input-label" htmlFor="street">Street Address</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/location.svg" alt="" />
                <input id="street" type="text" placeholder="123 Main Street" />
              </div>

              <div className="form-row">
                <div>
                  <label className="input-label" htmlFor="city">City</label>
                  <div className="input-field">
                    <img className="input-icon" src="/icons/location.svg" alt="" />
                    <input id="city" type="text" placeholder="Springfield" />
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="zip">ZIP Code</label>
                  <div className="input-field">
                    <input id="zip" type="text" placeholder="12345" />
                  </div>
                </div>
              </div>

              <label className="input-label" htmlFor="role">Account Type</label>
              <div className="input-field">
                <select id="role" defaultValue="">
                  <option value="" disabled>Select your role</option>
                  <option>Resident</option>
                  <option>Collector</option>
                  <option>City Official</option>
                </select>
              </div>

              <label className="input-label" htmlFor="password">Password</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/lock.svg" alt="" />
                <input id="password" type="password" placeholder="Create a strong password" />
              </div>

              <label className="input-label" htmlFor="confirm">Confirm Password</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/lock.svg" alt="" />
                <input id="confirm" type="password" placeholder="Confirm your password" />
              </div>

              <label className="checkbox">
                <input type="checkbox" />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>

              <label className="checkbox">
                <input type="checkbox" />
                <span>Send me updates about community initiatives and platform features</span>
              </label>

              <button className="btn btn-primary btn-block" type="submit">Create Account</button>

              <div className="small center" style={{marginTop:10}}>Already have an account? <Link href="/signin">Sign in here</Link></div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}


