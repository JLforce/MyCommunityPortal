'use client'

import Link from 'next/link';
import Brand from '../../components/Brand';
import { signUp } from '../actions/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage(){
  const [message, setMessage] = useState(null);
  const router = useRouter();
  
  // State for location dropdowns
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // State for selected location
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');

  // State for selected location names
  const [locationNames, setLocationNames] = useState({ region: '', province: '', municipality: '', barangay: '' });

  async function handleSubmit(formData) {
    const result = await signUp(formData);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      // Redirect to signin page with a success message
      router.push('/signin?message=Successfully created an account. Please sign in.');
    }
  }

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('https://psgc.gitlab.io/api/regions/');
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      }
    };
    fetchRegions();
  }, []);

  // Fetch provinces when a region is selected
  useEffect(() => {
    if (!selectedRegion) return;
    const regionName = regions.find(r => r.code === selectedRegion)?.name;
    setLocationNames(prev => ({ ...prev, region: regionName, province: '', municipality: '', barangay: '' }));

    const fetchProvinces = async () => {
      const response = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`);
      const data = await response.json();
      setProvinces(data);
      setMunicipalities([]);
      setBarangays([]);
      setSelectedProvince('');
      setSelectedMunicipality('');
      setSelectedBarangay('');
    };
    fetchProvinces();
  }, [selectedRegion, regions]);

  // Fetch municipalities when a province is selected
  useEffect(() => {
    if (!selectedProvince) return;
    const provinceName = provinces.find(p => p.code === selectedProvince)?.name;
    setLocationNames(prev => ({ ...prev, province: provinceName, municipality: '', barangay: '' }));

    const fetchMunicipalities = async () => {
      const response = await fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`);
      const data = await response.json();
      setMunicipalities(data);
      setBarangays([]);
      setSelectedMunicipality('');
      setSelectedBarangay('');
    };
    fetchMunicipalities();
  }, [selectedProvince, provinces]);

  // Fetch barangays when a municipality is selected
  useEffect(() => {
    if (!selectedMunicipality) return;
    const municipalityName = municipalities.find(m => m.code === selectedMunicipality)?.name;
    setLocationNames(prev => ({ ...prev, municipality: municipalityName, barangay: '' }));

    const fetchBarangays = async () => {
      const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedMunicipality}/barangays/`);
      const data = await response.json();
      setBarangays(data);
      setSelectedBarangay('');
    };
    fetchBarangays();
  }, [selectedMunicipality, municipalities]);

  // Store barangay name when selected
  useEffect(() => {
    if (!selectedBarangay) return;
    const barangayName = barangays.find(b => b.code === selectedBarangay)?.name;
    setLocationNames(prev => ({ ...prev, barangay: barangayName }));
  }, [selectedBarangay, barangays]);

  return (
    <main>
      <div className="auth-topbar">
        <div className="container auth-topbar-inner">
          <Brand />
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

              {/* Hidden inputs to store the names for the form submission */}
              <input type="hidden" name="region" value={locationNames.region} />
              <input type="hidden" name="province" value={locationNames.province} />
              <input type="hidden" name="municipality" value={locationNames.municipality} />
              <input type="hidden" name="barangay" value={locationNames.barangay} />

              <label className="input-label" htmlFor="region">Region</label>
              <div className="input-field">
                <select id="region_select" required onChange={e => setSelectedRegion(e.target.value)} value={selectedRegion}>
                  <option value="" disabled>Select Region</option>
                  {regions.map(region => <option key={region.code} value={region.code}>{region.name}</option>)}
                </select>
              </div>

              <label className="input-label" htmlFor="province">Province</label>
              <div className="input-field">
                <select id="province_select" required disabled={!selectedRegion} onChange={e => setSelectedProvince(e.target.value)} value={selectedProvince}>
                  <option value="" disabled>Select Province</option>
                  {provinces.map(province => <option key={province.code} value={province.code}>{province.name}</option>)}
                </select>
              </div>

              <label className="input-label" htmlFor="municipality">City / Municipality</label>
              <div className="input-field">
                <select id="municipality_select" required disabled={!selectedProvince} onChange={e => setSelectedMunicipality(e.target.value)} value={selectedMunicipality}>
                  <option value="" disabled>Select City / Municipality</option>
                  {municipalities.map(mun => <option key={mun.code} value={mun.code}>{mun.name}</option>)}
                </select>
              </div>

              <label className="input-label" htmlFor="barangay">Barangay</label>
              <div className="input-field">
                <select id="barangay_select" required disabled={!selectedMunicipality} onChange={e => setSelectedBarangay(e.target.value)} value={selectedBarangay}>
                  <option value="" disabled>Select Barangay</option>
                  {barangays.map(bgy => <option key={bgy.code} value={bgy.code}>{bgy.name}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div>
                  <label className="input-label" htmlFor="zip_code">ZIP Code</label>
                  <div className="input-field">
                    <input id="zip_code" name="zip_code" type="text" placeholder="6046" required />
                  </div>
                </div>
              </div>

              <label className="input-label" htmlFor="role">Account Type</label>
              <div className="input-field">
                <select id="role" name="role" defaultValue="" required>
                  <option value="" disabled>Select your role</option>
                  <option value="Resident">Resident</option>
                  {/*<option value="Collector">Collector</option>*/}
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
