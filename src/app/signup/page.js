'use client'

import Link from 'next/link';
import { signUp } from '../actions/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage(){
  const [message, setMessage] = useState(null);
  const router = useRouter();

  async function handleSubmit(formData) {
    const result = await signUp(formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      // Redirect to signin page with a success message
      router.push('/signin?message=Successfully created an account. Please sign in.');
    }
  }

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

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form className="auth-form" action={handleSubmit}>
              <div className="form-row">
                <div>
                  <label className="input-label" htmlFor="firstName">First Name</label>
                  <div className="input-field">
                    <img className="input-icon" src="/icons/user.svg" alt="" />
                    <input id="firstName" name="first_name" type="text" placeholder="John" required />
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="lastName">Last Name</label>
                  <div className="input-field">
                    <img className="input-icon" src="/icons/user.svg" alt="" />
                    <input id="lastName" name="last_name" type="text" placeholder="Doe" required />
                  </div>
                </div>
              </div>

              <label className="input-label" htmlFor="email">Email Address</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/mail.svg" alt="" />
                <input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
              </div>

              <label className="input-label" htmlFor="phone">Phone Number</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/phone.svg" alt="" />
                <input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
              </div>

              <label className="input-label" htmlFor="street_address">Street Address</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/location.svg" alt="" />
                <input id="street_address" name="street_address" type="text" placeholder="123 Main Street" required />
              </div>

              <div className="form-row">
                <div>
                  <label className="input-label" htmlFor="city">City</label>
                  <div className="input-field">
                    <img className="input-icon" src="/icons/location.svg" alt="" />
                    <input id="city" name="city" type="text" placeholder="Springfield" required />
                  </div>
                </div>
                <div>
                  <label className="input-label" htmlFor="zip_code">ZIP Code</label>
                  <div className="input-field">
                    <input id="zip_code" name="zip_code" type="text" placeholder="12345" required />
                  </div>
                </div>
              </div>

              <label className="input-label" htmlFor="role">Account Type</label>
              <div className="input-field">
                <select id="role" name="role" defaultValue="" required>
                  <option value="" disabled>Select your role</option>
                  <option value="Resident">Resident</option>
                  <option value="Collector">Collector</option>
                  <option value="City Official">City Official</option>
                </select>
              </div>

              <label className="input-label" htmlFor="password">Password</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/lock.svg" alt="" />
                <input id="password" name="password" type="password" placeholder="Create a strong password" required />
              </div>

              <label className="input-label" htmlFor="confirm">Confirm Password</label>
              <div className="input-field">
                <img className="input-icon" src="/icons/lock.svg" alt="" />
                <input id="confirm" name="confirm" type="password" placeholder="Confirm your password" required />
              </div>

              <label className="checkbox">
                <input type="checkbox" required />
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
