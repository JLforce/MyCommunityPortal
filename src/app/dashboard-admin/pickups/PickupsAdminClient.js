"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/supabase';

export default function PickupsAdminClient({ user }) {
  const [pickups, setPickups] = useState([]);
  const router = useRouter();
  const [filteredPickups, setFilteredPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminProfile, setAdminProfile] = useState(null);

  // Fetch all pickups with user information
  useEffect(() => {
    const fetchPickups = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Fetch the logged-in admin's profile to get their municipality
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('municipality')
          .eq('id', user.id)
          .single();

        if (profileError || !profile?.municipality) {
          console.error('Could not fetch admin profile or municipality is not set.', profileError);
          setPickups([]);
          setFilteredPickups([]);
          setLoading(false);
          return;
        }
        setAdminProfile(profile);
        const adminMunicipality = profile.municipality;

        // 2. Fetch pickups where the address contains the admin's municipality
        // We use 'ilike' for a case-insensitive search.
        const { data: pickupsData, error: pickupsError } = await supabase
          .from('pickup_schedule')
          .select('*')
          .ilike('address', `%${adminMunicipality}%`)
          .order('pickup_date', { ascending: true });

        if (pickupsError) {
          console.error('Error fetching pickups:', pickupsError);
          setPickups([]); setFilteredPickups([]);
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
  }, [user]);

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
    <main style={{paddingBottom:40}}>
          {/* Page Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
            <div>
              <h1 style={{margin:'0 0 6px',fontSize:32,fontWeight:800,color:'#111827'}}>Pickups</h1>
              <p style={{margin:0,fontSize:16,color:'#6b7280'}}>
                {adminProfile ? `Viewing pickups for ${adminProfile.municipality}` : 'Manage and monitor community waste management.'}
              </p>
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
                        const qs = new URLSearchParams({
                          id: pickup.id || '',
                          name: pickup.userName || '',
                          status: pickup.status || '',
                          type: pickup.pickup_type || 'Pickup',
                          datetime: pickup.pickup_date || '',
                          address: pickup.address || pickup.location || '',
                          notes: pickup.notes || '',
                          contact: pickup.contact_number || pickup.phone || ''
                        }).toString();
                        router.push(`/dashboard-admin/pickup-details?${qs}`);
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
  );
}
