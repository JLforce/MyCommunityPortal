"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/supabase';
import Brand from '../../../components/Brand';
import HeaderButtons from '../../../components/HeaderButtons';
import Link from 'next/link';

export default function PickupsAdminClient({ user }) {
  const [pickups, setPickups] = useState([]);
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all pickups with user information
  useEffect(() => {
    const fetchPickups = async () => {
      setLoading(true);
      try {
        // Fetch all pickups
        const { data: pickupsData, error: pickupsError } = await supabase
          .from('pickup_schedule')
          .select('*')
          .order('pickup_date', { ascending: true });

        if (pickupsError) {
          console.error('Error fetching pickups:', pickupsError);
          setLoading(false);
          return;
        }

        if (!pickupsData || pickupsData.length === 0) {
          setPickups([]);
          setFilteredPickups([]);
          setLoading(false);
          return;
        }

        // Get unique user IDs from pickups
        const userIds = [...new Set(pickupsData.map(p => p.user_id).filter(Boolean))];
        
        // Fetch profiles for all users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Create a map of user_id to profile
        const profileMap = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profileMap[profile.id] = profile;
          });
        }

        // Transform the data to include user name and location
        const transformedPickups = pickupsData.map(pickup => {
          const profile = profileMap[pickup.user_id];
          const userName = profile
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown User'
            : 'Unknown User';
          
          // Extract barangay from address or use address
          let location = 'N/A';
          if (pickup.address) {
            // Try to extract barangay if it contains "Barangay"
            const barangayMatch = pickup.address.match(/Barangay\s+([A-Za-z0-9]+)/i);
            if (barangayMatch) {
              location = `Barangay ${barangayMatch[1]}`;
            } else {
              // Try to extract from common patterns
              const locationMatch = pickup.address.match(/(Barangay\s+[A-Za-z0-9]+|Sector\s+[0-9]+|[A-Za-z\s]+(?:Street|Avenue|Road))/i);
              if (locationMatch) {
                location = locationMatch[1];
              } else {
                location = pickup.address;
              }
            }
          }
          
          return {
            ...pickup,
            userName,
            location
          };
        });

        setPickups(transformedPickups);
        setFilteredPickups(transformedPickups);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickups();
  }, []);

  // Filter pickups based on search
  useEffect(() => {
    let filtered = [...pickups];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pickup => 
        pickup.userName?.toLowerCase().includes(query) ||
        pickup.pickup_type?.toLowerCase().includes(query) ||
        pickup.location?.toLowerCase().includes(query) ||
        pickup.address?.toLowerCase().includes(query)
      );
    }

    setFilteredPickups(filtered);
  }, [searchQuery, pickups]);

  // Format date and time for display
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    
    if (timeString) {
      // Format time from "8:00 AM - 10:00 AM" to "08:00 AM" (take first time)
      const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const ampm = timeMatch[3].toUpperCase();
        
        // Format as "08:00 AM"
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
        return `${formattedDate} at ${formattedTime}`;
      }
      // If format doesn't match, try to extract first time from range
      const rangeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (rangeMatch) {
        let hours = parseInt(rangeMatch[1]);
        const minutes = rangeMatch[2];
        const ampm = rangeMatch[3].toUpperCase();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
        return `${formattedDate} at ${formattedTime}`;
      }
      return `${formattedDate} at ${timeString}`;
    }
    
    // Default time for regular pickups
    return `${formattedDate} at 08:00 AM`;
  };

  // Format pickup type for display
  const formatPickupType = (type) => {
    if (!type) return 'Regular Pickup';
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' Pickup';
  };

  // Get status badge styling
  const getStatusBadge = (pickup) => {
    const statusLower = (pickup.status || '').toLowerCase();
    
    // Check if status indicates completed
    if (statusLower.includes('completed') || statusLower.includes('done') || statusLower.includes('finished')) {
      return {
        bg: '#dff6e6',
        color: '#065f46',
        text: 'completed',
        icon: (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#10b981" />
            <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      };
    }
    
    // Check if pickup date is in the past (fallback for determining completed)
    const pickupDate = pickup.pickup_date ? new Date(pickup.pickup_date) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (pickupDate) {
      pickupDate.setHours(0, 0, 0, 0);
      // If pickup date is in the past and no status, consider it completed
      if (pickupDate < today && !statusLower) {
        return {
          bg: '#dff6e6',
          color: '#065f46',
          text: 'completed',
          icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#10b981" />
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        };
      }
    }
    
    // Default to scheduled
    return {
      bg: '#fff3e0',
      color: '#b45309',
      text: 'scheduled',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#f59e0b" />
          <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    };
  };

  return (
    <div className="admin-dashboard-root">
      <header className="dashboard-header" style={{padding:'18px 0',background:'var(--green-50)',borderBottom:'1px solid rgba(16,185,129,0.06)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Brand />
            <div style={{marginLeft:12}}>
              <h2 className="dashboard-title" style={{margin:0}}>
                <span className="title-main">City Authority</span>
                <span className="title-tag"> (Admin)</span>
              </h2>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <HeaderButtons />
          </div>
        </div>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:32,alignItems:'start',marginTop:20}} className="container">
        <aside style={{width:300,background:'var(--green-50)',padding:'28px 22px',borderRadius:12,border:'1px solid rgba(16,185,129,0.04)',minHeight:720}}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <Link href="/dashboard-admin" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--dashboard">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="#065f46" />
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="#065f46" />
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="#065f46" />
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="#065f46" />
                </svg>
              </div>
              <span>Dashboard</span>
            </Link>

            <Link href="/dashboard-admin/analytics" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--analytics">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="10" width="3" height="8" rx="1" fill="#065f46" />
                  <rect x="9" y="6" width="3" height="12" rx="1" fill="#065f46" />
                  <rect x="15" y="3" width="3" height="15" rx="1" fill="#065f46" />
                </svg>
              </div>
              Analytics
            </Link>

            <Link href="/dashboard-admin/reports" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--reports">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3z" fill="#c2410c" />
                  <rect x="9" y="8" width="6" height="1.6" rx="0.8" fill="#fff" opacity="0.9" />
                </svg>
              </div>
              Reports
            </Link>

            <Link href="/dashboard-admin/pickups" className="nav-link active" style={{display:'flex',alignItems:'center',gap:12,padding:'14px 20px',borderRadius:10,background:'var(--green-900)',color:'#fff',fontSize:18,fontWeight:800}}>
              <div className="nav-icon nav-icon--pickup">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="8" width="12" height="6" rx="1" fill="#ffffff" />
                  <rect x="15" y="9" width="5" height="3" rx="0.8" fill="#ffffff" />
                  <circle cx="8" cy="17" r="1.4" fill="#fff" />
                  <circle cx="18" cy="17" r="1.4" fill="#fff" />
                </svg>
              </div>
              <span>Pickups</span>
            </Link>

            <Link href="/users" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--users">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="3" fill="#0f172a" />
                  <path d="M4 19c1.5-4 7-4 8-4s6.5 0 8 4v1H4v-1z" fill="#0f172a" />
                </svg>
              </div>
              Users
            </Link>
          </div>
        </aside>

        <main style={{paddingBottom:40}}>
          {/* Page Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
            <div>
              <h1 style={{margin:'0 0 6px',fontSize:32,fontWeight:800,color:'#111827'}}>Pickups</h1>
              <p style={{margin:0,fontSize:16,color:'#6b7280'}}>Manage and monitor community waste management.</p>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{marginBottom:24}}>
            <div style={{position:'relative'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9ca3af'}}>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Search pickups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width:'100%',
                  padding:'12px 12px 12px 42px',
                  borderRadius:8,
                  border:'1px solid #e5e7eb',
                  fontSize:15,
                  outline:'none',
                  transition:'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Pickups Grid - 3 columns */}
          {loading ? (
            <div style={{padding:40,textAlign:'center',color:'#6b7280'}}>Loading pickups...</div>
          ) : filteredPickups.length === 0 ? (
            <div style={{padding:40,textAlign:'center',color:'#6b7280'}}>No pickups found.</div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:20}}>
              {filteredPickups.map((pickup) => {
                const statusBadge = getStatusBadge(pickup);
                
                return (
                  <div
                    key={pickup.id}
                    style={{
                      background:'#fff',
                      borderRadius:12,
                      border:'1px solid #e5e7eb',
                      padding:20,
                      boxShadow:'0 1px 3px rgba(0,0,0,0.08)',
                      display:'flex',
                      flexDirection:'column',
                      gap:16,
                      position:'relative'
                    }}
                  >
                    {/* Status Badge - Top Right */}
                    <div style={{position:'absolute',top:20,right:20}}>
                      <span style={{
                        display:'inline-flex',
                        alignItems:'center',
                        gap:6,
                        padding:'5px 12px',
                        borderRadius:999,
                        background:statusBadge.bg,
                        color:statusBadge.color,
                        fontSize:12,
                        fontWeight:600
                      }}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Name */}
                    <div style={{fontSize:18,fontWeight:700,color:'#111827',paddingRight:100}}>
                      {pickup.userName}
                    </div>

                    {/* Pickup Type */}
                    <div style={{fontSize:15,color:'#374151',fontWeight:500}}>
                      {formatPickupType(pickup.pickup_type)}
                    </div>

                    {/* Date and Time */}
                    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#6b7280'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{formatDateTime(pickup.pickup_date, pickup.pickup_time)}</span>
                    </div>

                    {/* Location */}
                    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#6b7280'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{pickup.location}</span>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => {
                        // TODO: Implement view details functionality
                        console.log('View details for pickup:', pickup.id);
                      }}
                      style={{
                        width:'100%',
                        padding:'10px 16px',
                        borderRadius:8,
                        border:'none',
                        background:'var(--green-900)',
                        color:'#fff',
                        fontSize:14,
                        fontWeight:600,
                        cursor:'pointer',
                        transition:'background 0.2s',
                        marginTop:'auto'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#065f46'}
                      onMouseLeave={(e) => e.target.style.background = 'var(--green-900)'}
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

