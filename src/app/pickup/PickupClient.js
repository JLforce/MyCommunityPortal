"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase/supabase';
import HeaderButtons from '../../components/HeaderButtons';
import Brand from '../../components/Brand';
import LiveStatus from '../../components/LiveStatus';

const LeafIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2C12 2 7 7 7 11c0 4 3 7 5 9 2-2 5-5 5-9 0-4-5-9-5-9z" fill="#16a34a" />
    <path d="M12 2c0 0 2.5 1.8 3.8 3.3C18.4 7 19 8.5 19 11c0 2-1 4-3 6-1.3-1.2-3.5-3.5-4.2-5.1C9.8 10 10 7 12 2z" fill="#059669" opacity="0.9" />
  </svg>
);

const RecycleIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 12v1a8 8 0 01-8 8 8 8 0 01-8-8V11" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12l3-3 3 3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12l-3 3-3-3" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2L2 20h20L12 2z" fill="#FFEDD5" stroke="#fb923c" strokeWidth="1.2" />
    <path d="M12 9v4" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 17h.01" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CheckIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="#ECFDF5" stroke="#10b981" strokeWidth="1.2" />
    <path d="M8 12.5l1.8 1.8L16 9" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CogIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 015.28 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.4 6.6A2 2 0 017.23 3.77l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c.12.7.7 1.24 1.4 1.39h.24a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0120.72 6.1l-.06.06a1.65 1.65 0 00-.33 1.82v.24c.15.7.69 1.28 1.39 1.4H21a2 2 0 010 4h-.09c-.7.12-1.24.7-1.39 1.4v.24z" stroke="#374151" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = ({width=18,height=18}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Status icons for tracking
const ClockIcon = ({width=24,height=24}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <path d="M12 6v6l4 2" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = ({width=24,height=24}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
    <path d="M16 3v4M8 3v4M3 11h18" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TruckIcon = ({width=24,height=24}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M1 3h15v13H1z" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 8h4l3 3v5h-7V8z" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="19" r="2" fill="#F97316" />
    <circle cx="19" cy="19" r="2" fill="#F97316" />
  </svg>
);

const CheckmarkIcon = ({width=24,height=24}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="10" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
    <path d="M8 12l2 2 4-4" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Sidebar() {
  return (
    <aside className="sidebar" role="navigation" aria-label="Primary">
        <div className="sidebar-brand">
          <Brand size="small" />
        </div>

      <nav>
        <Link href="/dashboard" className="nav-link">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="icon-box" aria-hidden>
              <LeafIcon width={16} height={16} />
            </span>
            <span>Dashboard</span>
          </div>
        </Link>

        <Link href="/pickup" className="nav-link active" aria-current="page">
          <span className="icon-box" aria-hidden>
            <RecycleIcon width={16} height={16} />
          </span>
          <span>Pickup</span>
        </Link>

        <Link href="/reports" className="nav-link">
          <span className="icon-box" aria-hidden>
            <WarningIcon width={16} height={16} />
          </span>
          <span>Reports</span>
        </Link>

        <Link href="/guide" className="nav-link">
          <span className="icon-box" aria-hidden>
            <CheckIcon width={16} height={16} />
          </span>
          <span>Guide</span>
        </Link>

       {/*} <Link href="/analytics" className="nav-link">
          <span className="icon-box" aria-hidden>
            <CogIcon width={16} height={16} />
          </span>
          <span>Analytics</span>
        </Link>*/}

        <Link href="/ai-assistant" className="nav-link">
          <span className="icon-box" aria-hidden>
            <UserIcon width={16} height={16} />
          </span>
          <span>Chatbot</span>
        </Link>
      </nav>
    </aside>
  );
}

function DashboardHeader(){
  return (
    <header className="dashboard-header">
      <div className="container">
        <div className="brand">
          <Brand />
        </div>
        
        <div className="header-actions">
          <HeaderButtons />
        </div>
      </div>
    </header>
  );
}

function StatusPill({children, color='green'}){
  const bg = color === 'green' ? '#D1FAE5' : color === 'orange' ? '#FED7AA' : color === 'yellow' ? '#FEF3C7' : '#DBEAFE';
  const text = color === 'green' ? '#059669' : color === 'orange' ? '#B45309' : color === 'yellow' ? '#B45309' : '#3730A3';
  return <span style={{background:bg,color:text,padding:'6px 12px',borderRadius:999,fontWeight:700,fontSize:13}}>{children}</span>;
}

// Date Picker Icon for modal (grey version)
const DatePickerIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#6B7280" strokeWidth="1.5" />
    <path d="M16 3v4M8 3v4M3 11h18" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Chevron Down Icon for dropdown
const ChevronDownIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Close/X Icon for modal
const CloseIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Helper function to get status icon and color
function getStatusInfo(status) {
  const statusLower = status?.toLowerCase() || 'pending';
  
  if (statusLower.includes('scheduled') || statusLower.includes('confirmed')) {
    return { icon: <CalendarIcon />, color: 'blue', label: 'Scheduled' };
  } else if (statusLower.includes('in-progress') || statusLower.includes('picked up')) {
    return { icon: <TruckIcon />, color: 'orange', label: 'In Progress' };
  } else if (statusLower.includes('completed') || statusLower.includes('done')) {
    return { icon: <CheckmarkIcon />, color: 'green', label: 'Completed' };
  } else {
    return { icon: <ClockIcon />, color: 'yellow', label: 'Pending' };
  }
}

export default function PickupClient({ user }){
  const [pickupType, setPickupType] = useState('regular');
  const [wasteVolume, setWasteVolume] = useState(50); // 0 = Small, 50 = Medium, 100 = Large
  const [showModal, setShowModal] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [instructions, setInstructions] = useState('');
  const [pickupRequests, setPickupRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const dateInputRef = useRef(null);

  // Fetch user profile and existing pickup requests
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        
        // Check session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('=== Pickup: Fetching Profile ===');
        console.log('User ID:', user.id);
        console.log('Has session:', !!session);
        console.log('Session user ID:', session?.user?.id);
        console.log('Session error:', sessionError);
        
        // Fetch user profile for address
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          console.error('Full error:', profileError);
        } else {
          if (profileData) {
            console.log('Profile data fetched:', profileData);
            console.log('Street Address:', profileData?.street_address);
            console.log('City:', profileData?.city);
            console.log('Zip Code:', profileData?.zip_code);
            console.log('Full profile object:', JSON.stringify(profileData, null, 2));
          } else {
            console.warn('No profile found for user. User needs to complete their profile.');
          }
          setProfile(profileData);
        }
        
        console.log('================================');

        // Fetch existing pickup requests
        const { data: pickupsData, error: pickupsError } = await supabase
          .from('pickup_schedule')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (pickupsError) {
          console.error('Error fetching pickups:', pickupsError.message);
        } else {
          setPickupRequests(pickupsData || []);
        }

        setLoading(false);
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getVolumeLabel = (value) => {
    if (value < 33) return 'Small';
    if (value < 67) return 'Medium';
    return 'Large';
  };

  const handlePickupTypeChange = (value) => {
    setPickupType(value);
    if (value === 'special') {
      setShowModal(true);
    } else {
      setShowModal(false);
      setPreferredDate('');
      setTimeSlot('');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // If closing without selecting, revert to regular
    if (!preferredDate && !timeSlot) {
      setPickupType('regular');
    }
  };

  const handleModalConfirm = () => {
    if (preferredDate && timeSlot) {
      setShowModal(false);
      // Form data is saved in state, ready for submission
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== Pickup: Form Submit ===');
    console.log('User:', user);
    console.log('Profile state:', profile);
    console.log('Profile type:', typeof profile);
    console.log('Profile is null?', profile === null);
    console.log('Profile is undefined?', profile === undefined);

    if (!user) {
      alert('You must be logged in to submit a pickup request.');
      return;
    }

    // Build address from profile
    let fullAddress = '';
    if (profile) {
      console.log('Profile exists, checking address fields:');
      console.log('street_address:', profile.street_address);
      console.log('barangay:', profile.barangay);
      console.log('municipality:', profile.municipality);
      console.log('zip_code:', profile.zip_code);
      
      const addressParts = [
        profile.street_address,
        profile.barangay,
        profile.municipality,
        profile.province,
      ].filter(Boolean);
      
      console.log('Address parts after filter:', addressParts);
      fullAddress = addressParts.join(', ');
      console.log('Full address:', fullAddress);
    } else {
      console.log('Profile is null/undefined, cannot build address');
    }

    if (!fullAddress) {
      console.error('Address validation failed - fullAddress is empty');
      console.error('Profile object:', profile);
      if (!profile) {
        alert('Please complete your profile with an address before scheduling a pickup. You will be redirected to your profile page.');
        window.location.href = '/profile';
      } else {
        alert('Please complete your profile with a full address before scheduling a pickup. You will be redirected to your profile page.');
        window.location.href = '/profile';
      }
      return;
    }
    
    console.log('Address validation passed');
    console.log('================================');

    // For regular pickups, calculate next pickup date (7 days from now)
    let pickupDate = null;
    if (pickupType === 'regular') {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      pickupDate = nextWeek.toISOString().split('T')[0];
    } else if (pickupType === 'special') {
      pickupDate = preferredDate;
    }

    if (pickupType === 'special' && (!preferredDate || !timeSlot)) {
      alert('Please select a date and time slot for special pickup.');
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('pickup_schedule')
        .insert([
          {
            user_id: user.id,
            pickup_type: pickupType,
            waste_volume: getVolumeLabel(wasteVolume),
            pickup_date: pickupDate,
            pickup_time: pickupType === 'special' ? timeSlot : null,
            instructions: instructions || null,
            address: fullAddress,
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting pickup:', error);
        alert('Error submitting pickup request: ' + error.message);
        setSubmitting(false);
        return;
      }

      alert('Pickup request submitted successfully!');
      
      // Reset form
      setPickupType('regular');
      setWasteVolume(50);
      setPreferredDate('');
      setTimeSlot('');
      setInstructions('');

      // Refresh pickup requests list
      const { data: newPickups, error: fetchError } = await supabase
        .from('pickup_schedule')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!fetchError) {
        setPickupRequests(newPickups || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Time slot options
  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
  ];

  return (
    <>
      <DashboardHeader />

      <main className="page-fade-in" style={{padding:'28px 0'}}>
        <div className="container pickup-layout">
          <Sidebar />

          <div className="pickup-main-content">
            <div className="page-header" style={{marginBottom:24}}>
              <h1>Waste Pickup Management</h1>
              <p className="muted">Schedule and track your waste collection requests.</p>
            </div>

            {/* Schedule Pickup Request Section */}
            <div className="card" style={{marginBottom:24, background:'#fff', padding:'32px'}}>
              <div style={{marginBottom:20}}>
                <h2 style={{margin:'0 0 6px', fontSize:24, color:'var(--green-900)'}}>Schedule Pickup Request</h2>
                <p className="muted" style={{margin:0, fontSize:14}}>Request regular or special waste collection</p>
                {profile && (
                  <p className="muted" style={{margin:'8px 0 0', fontSize:13}}>
                    Pickup address: {[profile.street_address, profile.barangay, profile.municipality, profile.province].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Pickup Type */}
                <div style={{marginBottom:24}}>
                  <label style={{display:'block', marginBottom:12, fontWeight:700, fontSize:14, color:'var(--text-900)'}}>
                    Pickup Type
                  </label>
                  <div style={{display:'flex', flexDirection:'column', gap:12}}>
                    <label style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:12, borderRadius:10, border:'2px solid', borderColor: pickupType === 'regular' ? '#10B981' : '#E5E7EB', background: pickupType === 'regular' ? '#ECFDF5' : '#fff', transition:'all 0.2s'}}>
                      <input
                        type="radio"
                        name="pickupType"
                        value="regular"
                        checked={pickupType === 'regular'}
                        onChange={(e) => handlePickupTypeChange(e.target.value)}
                        style={{width:18, height:18, accentColor:'#10B981', cursor:'pointer'}}
                      />
                      <span style={{fontWeight:600, color:'var(--text-900)'}}>Regular Pickup (default weekly schedule)</span>
                    </label>
                    <label style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:12, borderRadius:10, border:'2px solid', borderColor: pickupType === 'special' ? '#10B981' : '#E5E7EB', background: pickupType === 'special' ? '#ECFDF5' : '#fff', transition:'all 0.2s'}}>
                      <input
                        type="radio"
                        name="pickupType"
                        value="special"
                        checked={pickupType === 'special'}
                        onChange={(e) => handlePickupTypeChange(e.target.value)}
                        style={{width:18, height:18, accentColor:'#10B981', cursor:'pointer'}}
                      />
                      <span style={{fontWeight:600, color:'var(--text-900)'}}>Special Pickup (custom date/time selection)</span>
                    </label>
                  </div>
                </div>

                {/* Waste Volume Estimate */}
                <div style={{marginBottom:24}}>
                  <label style={{display:'block', marginBottom:12, fontWeight:700, fontSize:14, color:'var(--text-900)'}}>
                    Waste Volume Estimate
                  </label>
                  <div style={{padding:'0 8px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                      <span style={{fontSize:13, color:'var(--text-600)', fontWeight:600}}>Small</span>
                      <span style={{fontSize:13, color:'var(--text-600)', fontWeight:600}}>Large</span>
                    </div>
                    <div style={{position:'relative', width:'100%'}}>
                      {/* Background track */}
                      <div style={{
                        position:'absolute',
                        top:'50%',
                        left:0,
                        right:0,
                        height:8,
                        background:'#E5E7EB',
                        borderRadius:4,
                        transform:'translateY(-50%)',
                        zIndex:1
                      }}></div>
                      {/* Filled bar */}
                      <div style={{
                        position:'absolute',
                        top:'50%',
                        left:0,
                        width:`${wasteVolume}%`,
                        height:8,
                        background:'#10B981',
                        borderRadius:4,
                        transform:'translateY(-50%)',
                        zIndex:2,
                        transition:'width 0.2s ease'
                      }}></div>
                      {/* Range input on top */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={wasteVolume}
                        onChange={(e) => setWasteVolume(parseInt(e.target.value))}
                        style={{
                          position:'relative',
                          width:'100%',
                          zIndex:3,
                          background:'transparent'
                        }}
                        className="volume-slider"
                      />
                    </div>
                    <div style={{marginTop:8, textAlign:'center'}}>
                      <span style={{fontSize:13, color:'var(--text-700)', fontWeight:600}}>Current: {getVolumeLabel(wasteVolume)}</span>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div style={{marginBottom:24}}>
                  <label style={{display:'block', marginBottom:12, fontWeight:700, fontSize:14, color:'var(--text-900)'}}>
                    Special Instructions
                  </label>
                  <textarea
                    placeholder="Additional notes for collection team..."
                    rows={4}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #E5E7EB', fontSize:14, fontFamily:'inherit', resize:'vertical', outline:'none', transition:'border-color 0.2s'}}
                    onFocus={(e) => e.target.style.borderColor = '#10B981'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{display:'flex', gap:12, justifyContent:'flex-start'}}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{padding:'12px 32px', background:submitting ? '#D1D5DB' : '#10B981', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor:submitting ? 'not-allowed' : 'pointer', boxShadow:submitting ? 'none' : '0 4px 12px rgba(16,185,129,0.3)', transition:'all 0.2s', opacity:submitting ? 0.6 : 1}}
                    onMouseEnter={(e) => {
                      if (!submitting) {
                        e.target.style.background = '#059669';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) {
                        e.target.style.background = '#10B981';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPickupType('regular');
                      setWasteVolume(50);
                      setPreferredDate('');
                      setTimeSlot('');
                      setInstructions('');
                    }}
                    disabled={submitting}
                    style={{padding:'12px 24px', background:'#fff', color:'var(--text-700)', border:'1px solid #E5E7EB', borderRadius:10, fontWeight:600, fontSize:15, cursor:submitting ? 'not-allowed' : 'pointer', transition:'all 0.2s', opacity:submitting ? 0.6 : 1}}
                    onMouseEnter={(e) => {
                      if (!submitting) {
                        e.target.style.background = '#F9FAFB';
                        e.target.style.borderColor = '#D1D5DB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) {
                        e.target.style.background = '#fff';
                        e.target.style.borderColor = '#E5E7EB';
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Request Tracking Section */}
            <div className="card" style={{background:'#fff', padding:'32px'}}>
              <div style={{marginBottom:20}}>
                <h2 style={{margin:'0 0 6px', fontSize:24, color:'var(--green-900)'}}>Request Tracking</h2>
                <p className="muted" style={{margin:0, fontSize:14}}>Monitor your pickup request status</p>
              </div>

              {loading ? (
                <div style={{padding:48, textAlign:'center'}}>
                  <p className="muted">Loading pickup requests...</p>
                </div>
              ) : pickupRequests.length === 0 ? (
                <div style={{padding:48, textAlign:'center', borderRadius:12, background:'#F9FAFB', border:'1px dashed #E5E7EB'}}>
                  <div style={{marginBottom:16, display:'flex', justifyContent:'center'}}>
                    <div style={{width:64, height:64, borderRadius:50, background:'#ECFDF5', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <RecycleIcon width={32} height={32} />
                    </div>
                  </div>
                  <h3 style={{margin:'0 0 8px', fontSize:18, color:'var(--text-900)', fontWeight:700}}>No Pickup Requests Yet</h3>
                  <p className="muted" style={{margin:0, fontSize:14, maxWidth:400, marginLeft:'auto', marginRight:'auto'}}>
                    You haven't submitted any pickup requests. Submit a request above to get started.
                  </p>
                </div>
              ) : (
                <div style={{display:'flex', flexDirection:'column', gap:16}}>
                  {pickupRequests.map((request) => {
                    const statusInfo = getStatusInfo(request.status || 'pending');
                    const pickupDate = request.pickup_date ? new Date(request.pickup_date).toLocaleDateString() : 'Not scheduled';
                    const pickupTime = request.pickup_time || 'N/A';
                    
                    return (
                      <div 
                        key={request.id} 
                        style={{
                          display:'flex', 
                          alignItems:'center', 
                          gap:16, 
                          padding:16, 
                          borderRadius:12, 
                          background:statusInfo.color === 'green' ? '#ECFDF5' : statusInfo.color === 'orange' ? '#FFF7ED' : statusInfo.color === 'blue' ? '#EFF6FF' : '#FEFCE8',
                          border:`1px solid ${statusInfo.color === 'green' ? '#10B981' : statusInfo.color === 'orange' ? '#F97316' : statusInfo.color === 'blue' ? '#3B82F6' : '#EAB308'}`
                        }}
                      >
                        <div style={{flexShrink:0}}>
                          {statusInfo.icon}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700, fontSize:15, color:'var(--text-900)', marginBottom:4}}>
                            {request.pickup_type === 'regular' ? 'Regular Pickup' : 'Special Pickup'}
                          </div>
                          <div style={{fontSize:13, color:'var(--text-600)', marginBottom:2}}>
                            Date: {pickupDate}
                          </div>
                          {request.pickup_time && (
                            <div style={{fontSize:13, color:'var(--text-600)', marginBottom:2}}>
                              Time: {pickupTime}
                            </div>
                          )}
                          <div style={{fontSize:13, color:'var(--text-600)', marginBottom:2}}>
                            Volume: {request.waste_volume}
                          </div>
                          {request.address && (
                            <div style={{fontSize:13, color:'var(--text-600)'}}>
                              Address: {request.address}
                            </div>
                          )}
                        </div>
                        <StatusPill color={statusInfo.color}>{statusInfo.label}</StatusPill>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer area spacing */}
            <div style={{height:36}} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="col">
              <h4>About MyCommunityPortal</h4>
              <p className="muted" style={{marginTop:6}}>A simple way to manage community services — pickups, reports, and assistance all in one place.</p>
              <div className="socials" aria-hidden>
                <a href="#" title="Twitter" aria-label="Twitter" style={{color:'var(--green-900)'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6.2c-.5.2-1 .3-1.6.4.6-.4 1-1 1.3-1.8-.6.4-1.4.7-2.2.9C16.7 5 15.7 4.5 14.5 4.5c-1.8 0-3.2 1.5-3.2 3.3 0 .3 0 .6.1.8C8.1 8.5 5.4 7 3.7 4.6c-.3.6-.5 1.1-.5 1.8 0 1.2.6 2.2 1.6 2.8-.5 0-1-.2-1.4-.4v.1c0 1.8 1.3 3.3 3 3.6-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.7 2.4 3.3 2.4C7.3 17.9 5.1 18.7 2.7 18.7c-.4 0-.8 0-1.2-.1 1.7 1.1 3.8 1.8 6 1.8 7.2 0 11.2-6 11.2-11.2v-.5c.8-.6 1.4-1.4 1.9-2.3-.8.4-1.6.7-2.5.9z" fill="#10B981"/></svg>
                </a>
                <a href="#" title="Facebook" aria-label="Facebook" style={{color:'var(--green-900)'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.1C22 6.6 17.5 2 12 2S2 6.6 2 12.1c0 5 3.7 9.1 8.5 9.9v-7H8.2v-3h2.3V9.1c0-2.3 1.4-3.6 3.4-3.6.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.3v1.6h2.2l-.4 3h-1.8v7C18.3 21.2 22 17.2 22 12.1z" fill="#16A34A"/></svg>
                </a>
              </div>
            </div>

            <div className="col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/pickup" className="glow-link">Schedule Pickup</Link></li>
                <li><Link href="/reports" className="glow-link">Report Issue</Link></li>
                <li><Link href="/guide" className="glow-link">Waste Guide</Link></li>
                <li><Link href="/ai-assistant" className="glow-link">AI Assistant</Link></li>
              </ul>
            </div>

            <div className="col">
              <h4>Contact</h4>
              <p className="muted" style={{marginTop:6}}>Phone: <strong>(555) 123-4567</strong><br/>Email: <Link href="mailto:support@mycommunityportal.com" className="glow-link">support@mycommunityportal.com</Link></p>
            </div>

            <div className="col">
              <h4>System Status</h4>
              <div style={{marginTop:6, display:'flex', alignItems:'center', gap:8}}>
                <span className="status-dot pulse" aria-hidden />
                <LiveStatus />
              </div>
            </div>
          </div>

          <div className="bottom-row">
            <div className="muted">© {new Date().getFullYear()} MyCommunityPortal — All rights reserved.</div>
            <div className="muted">Built with care · <Link href="/guide">Waste Guide</Link></div>
          </div>
        </div>
      </footer>

      {/* Special Pickup Date/Time Modal */}
      {showModal && (
        <div 
          style={{
            position:'fixed',
            top:0,
            left:0,
            right:0,
            bottom:0,
            background:'rgba(0,0,0,0.5)',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            zIndex:1000,
            padding:20
          }}
          onClick={handleModalClose}
        >
          <div 
            style={{
              background:'#fff',
              borderRadius:16,
              padding:32,
              maxWidth:500,
              width:'100%',
              boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
              position:'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              style={{
                position:'absolute',
                top:16,
                right:16,
                background:'transparent',
                border:'none',
                cursor:'pointer',
                padding:8,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                borderRadius:8,
                transition:'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
              aria-label="Close modal"
            >
              <CloseIcon width={20} height={20} />
            </button>

            {/* Modal Header */}
            <div style={{marginBottom:24}}>
              <h2 style={{margin:'0 0 8px', fontSize:24, color:'var(--green-900)', fontWeight:700}}>Select Pickup Date & Time</h2>
              <p className="muted" style={{margin:0, fontSize:14}}>Choose your preferred date and time slot for special pickup</p>
            </div>

            {/* Preferred Pickup Date */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block', marginBottom:8, fontWeight:700, fontSize:14, color:'var(--text-900)'}}>
                Preferred Pickup Date
              </label>
              <div style={{position:'relative'}}>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="date-input-custom"
                  style={{
                    width:'100%',
                    padding:'12px 40px 12px 12px',
                    borderRadius:10,
                    border:'1px solid #E5E7EB',
                    fontSize:14,
                    fontFamily:'inherit',
                    outline:'none',
                    transition:'border-color 0.2s',
                    background:'#fff',
                    color: preferredDate ? 'var(--text-900)' : '#9CA3AF',
                    position:'relative',
                    zIndex:1
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10B981';
                    if (!preferredDate) {
                      e.target.style.color = 'var(--text-900)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    if (!preferredDate) {
                      e.target.style.color = '#9CA3AF';
                    }
                  }}
                />
                {!preferredDate && (
                  <div 
                    className="date-placeholder"
                    style={{
                      position:'absolute',
                      left:12,
                      top:'50%',
                      transform:'translateY(-50%)',
                      pointerEvents:'none',
                      color:'#9CA3AF',
                      fontSize:14,
                      zIndex:2,
                      userSelect:'none'
                    }}
                  >
                    dd/mm/yyyy
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (dateInputRef.current) {
                      dateInputRef.current.showPicker?.() || dateInputRef.current.focus();
                    }
                  }}
                  style={{
                    position:'absolute',
                    right:12,
                    top:'50%',
                    transform:'translateY(-50%)',
                    background:'transparent',
                    border:'none',
                    cursor:'pointer',
                    padding:4,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    zIndex:3,
                    transition:'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  aria-label="Open date picker"
                >
                  <DatePickerIcon width={20} height={20} />
                </button>
              </div>
            </div>

            {/* Time Slot */}
            <div style={{marginBottom:24}}>
              <label style={{display:'block', marginBottom:8, fontWeight:700, fontSize:14, color:'var(--text-900)'}}>
                Time Slot
              </label>
              <div style={{position:'relative'}}>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{
                    width:'100%',
                    padding:'12px 40px 12px 12px',
                    borderRadius:10,
                    border:'1px solid #E5E7EB',
                    fontSize:14,
                    fontFamily:'inherit',
                    outline:'none',
                    transition:'border-color 0.2s',
                    background:'#fff',
                    appearance:'none',
                    cursor:'pointer',
                    color: timeSlot ? 'var(--text-900)' : '#9CA3AF'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10B981'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                >
                  <option value="" disabled>Select time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot} style={{color:'var(--text-900)'}}>
                      {slot}
                    </option>
                  ))}
                </select>
                <div style={{
                  position:'absolute',
                  right:12,
                  top:'50%',
                  transform:'translateY(-50%)',
                  pointerEvents:'none'
                }}>
                  <ChevronDownIcon width={20} height={20} />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
              <button
                type="button"
                onClick={handleModalClose}
                style={{
                  padding:'12px 24px',
                  background:'#fff',
                  color:'var(--text-700)',
                  border:'1px solid #E5E7EB',
                  borderRadius:10,
                  fontWeight:600,
                  fontSize:15,
                  cursor:'pointer',
                  transition:'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#F9FAFB';
                  e.target.style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fff';
                  e.target.style.borderColor = '#E5E7EB';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalConfirm}
                disabled={!preferredDate || !timeSlot}
                style={{
                  padding:'12px 32px',
                  background: preferredDate && timeSlot ? '#10B981' : '#D1D5DB',
                  color:'#fff',
                  border:'none',
                  borderRadius:10,
                  fontWeight:700,
                  fontSize:15,
                  cursor: preferredDate && timeSlot ? 'pointer' : 'not-allowed',
                  transition:'all 0.2s',
                  opacity: preferredDate && timeSlot ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (preferredDate && timeSlot) {
                    e.target.style.background = '#059669';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (preferredDate && timeSlot) {
                    e.target.style.background = '#10B981';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
