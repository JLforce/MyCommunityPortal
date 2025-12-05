"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/supabase';

export default function ReportsAdminClient({ user }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminProfile, setAdminProfile] = useState(null);

  // Fetch all reports with resident information
  useEffect(() => {
    const fetchReports = async () => {
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
          setReports([]);
          setFilteredReports([]);
          setLoading(false);
          return;
        }
        setAdminProfile(profile);
        const adminMunicipality = profile.municipality;

        // 2. Fetch all reports and join with profiles to filter by the admin's municipality
        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select(`
            *,
            profile:profiles(first_name, last_name, email, municipality)
          `)
          .eq('profile.municipality', adminMunicipality)
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error('Error fetching reports:', reportsError);
          setReports([]); setFilteredReports([]);
          setLoading(false);
          return;
        }

        // Get unique user IDs from reports
        const userIds = [...new Set(reportsData.map(r => r.user_id).filter(Boolean))];
        
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

        // Transform the data to include resident name
        const transformedReports = reportsData.map(report => {
          const profile = profileMap[report.user_id];
          const residentName = profile
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown User'
            : 'Unknown User';
          
          return {
            ...report,
            residentName
          };
        });

        setReports(transformedReports);
        setFilteredReports(transformedReports);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter reports based on search and status
  useEffect(() => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report => 
        report.issue_type?.toLowerCase().includes(query) ||
        report.location?.toLowerCase().includes(query) ||
        report.residentName?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => {
        const status = (report.status || 'pending').toLowerCase();
        const filterLower = statusFilter.toLowerCase();
        
        // Handle different status variations
        if (filterLower === 'pending') {
          return status === 'pending' || !status;
        } else if (filterLower === 'under-review') {
          return status === 'under-review' || status === 'under_review';
        } else if (filterLower === 'in-progress') {
          return status === 'in-progress' || status === 'in_progress';
        } else if (filterLower === 'resolved') {
          return status === 'resolved';
        }
        return false;
      });
    }

    setFilteredReports(filtered);
  }, [searchQuery, statusFilter, reports]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Format report type for display
  const formatReportType = (type) => {
    if (!type) return 'Other Issues';
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format location - extract address if coordinates are present
  const formatLocation = (location) => {
    if (!location) return 'N/A';
    // If location contains coordinates pattern, try to extract address part
    if (location.includes('lat:') && location.includes('lng:')) {
      // Check if there's an address before the coordinates
      const coordMatch = location.match(/(.+?)\s*\(lat:/);
      if (coordMatch && coordMatch[1].trim()) {
        return coordMatch[1].trim();
      }
      // Otherwise return the full coordinate string
      return location;
    }
    return location;
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    
    if (statusLower === 'resolved') {
      return {
        bg: '#dff6e6',
        color: '#065f46',
        dotColor: '#10b981',
        text: 'Resolved'
      };
    } else if (statusLower === 'in-progress' || statusLower === 'in_progress') {
      return {
        bg: '#fff3e0',
        color: '#b45309',
        dotColor: '#f59e0b',
        text: 'In-Progress'
      };
    } else {
      // Handle pending, under-review, or any other status
      const isUnderReview = statusLower === 'under-review' || statusLower === 'under_review';
      return {
        bg: '#fee2e2',
        color: '#991b1b',
        dotColor: '#ef4444',
        text: isUnderReview ? 'Under Review' : 'Pending'
      };
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const priorityLower = (priority || 'low').toLowerCase();
    
    if (priorityLower.includes('high') || priorityLower.includes('urgent') || priorityLower.includes('critical')) {
      return { bg: '#fee2e2', color: '#991b1b', text: 'high' };
    } else if (priorityLower.includes('medium')) {
      return { bg: '#fff3e0', color: '#b45309', text: 'medium' };
    } else {
      return { bg: '#dff6e6', color: '#065f46', text: 'low' };
    }
  };

  return (
    <main style={{paddingBottom:40}}>
          {/* Page Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
            <div>
              <h1 style={{margin:'0 0 6px',fontSize:32,fontWeight:800,color:'#111827'}}>Reports</h1>
              <p style={{margin:0,fontSize:16,color:'#6b7280'}}>
                {adminProfile ? `Viewing reports for ${adminProfile.municipality}` : 'Manage and monitor community waste management.'}
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div style={{display:'flex',gap:16,marginBottom:24,alignItems:'center'}}>
            <div style={{flex:1,position:'relative'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#9ca3af'}}>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Search reports..."
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
            <div style={{position:'relative'}}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding:'12px 40px 12px 16px',
                  borderRadius:8,
                  border:'1px solid #e5e7eb',
                  fontSize:15,
                  background:'#fff',
                  cursor:'pointer',
                  outline:'none',
                  appearance:'none',
                  minWidth:160,
                  fontWeight:500
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="in-progress">In-Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#6b7280'}}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Reports Table */}
          <div style={{background:'#fff',borderRadius:12,border:'1px solid #e5e7eb',overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
            {loading ? (
              <div style={{padding:40,textAlign:'center',color:'#6b7280'}}>Loading reports...</div>
            ) : filteredReports.length === 0 ? (
              <div style={{padding:40,textAlign:'center',color:'#6b7280'}}>No reports found.</div>
            ) : (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
                    <th style={{padding:'14px 20px',textAlign:'left',fontSize:13,fontWeight:700,color:'#374151',letterSpacing:'0.01em'}}>Report Type</th>
                    <th style={{padding:'14px 20px',textAlign:'left',fontSize:13,fontWeight:700,color:'#374151',letterSpacing:'0.01em'}}>Location</th>
                    <th style={{padding:'14px 20px',textAlign:'left',fontSize:13,fontWeight:700,color:'#374151',letterSpacing:'0.01em'}}>Resident</th>
                    <th style={{padding:'14px 20px',textAlign:'left',fontSize:13,fontWeight:700,color:'#374151',letterSpacing:'0.01em'}}>Status</th>
                    <th style={{padding:'14px 20px',textAlign:'left',fontSize:13,fontWeight:700,color:'#374151',letterSpacing:'0.01em'}}>Priority</th>
                    <th style={{padding:'14px 20px',textAlign:'left',fontSize:13,fontWeight:700,color:'#374151',letterSpacing:'0.01em'}}>Date</th>
                    <th style={{padding:'14px 20px',textAlign:'left',fontSize:13,fontWeight:700,color:'#374151',letterSpacing:'0.01em'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => {
                    const statusBadge = getStatusBadge(report.status);
                    const priorityBadge = getPriorityBadge(report.priority);
                    
                    return (
                      <tr key={report.id} style={{borderBottom:index < filteredReports.length - 1 ? '1px solid #f3f4f6' : 'none',background:'#fff'}}>
                        <td style={{padding:'14px 20px',fontSize:14,color:'#111827',fontWeight:500}}>
                          {formatReportType(report.issue_type)}
                        </td>
                        <td style={{padding:'14px 20px',fontSize:14,color:'#374151'}}>
                          {formatLocation(report.location)}
                        </td>
                        <td style={{padding:'14px 20px',fontSize:14,color:'#374151'}}>
                          {report.residentName}
                        </td>
                        <td style={{padding:'14px 20px'}}>
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
                            <span style={{
                              width:6,
                              height:6,
                              borderRadius:'50%',
                              background:statusBadge.dotColor,
                              display:'inline-block'
                            }}></span>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td style={{padding:'14px 20px'}}>
                          <span style={{
                            display:'inline-block',
                            padding:'5px 10px',
                            borderRadius:999,
                            background:priorityBadge.bg,
                            color:priorityBadge.color,
                            fontSize:12,
                            fontWeight:600
                          }}>
                            {priorityBadge.text}
                          </span>
                        </td>
                        <td style={{padding:'14px 20px',fontSize:14,color:'#374151'}}>
                          {formatDate(report.created_at)}
                        </td>
                        <td style={{padding:'14px 20px'}}>
                          <button
                            onClick={() => {
                              // TODO: Implement edit functionality
                              console.log('Edit report:', report.id);
                            }}
                            style={{
                              display:'inline-flex',
                              alignItems:'center',
                              gap:5,
                              padding:'5px 10px',
                              borderRadius:6,
                              border:'1px solid #e5e7eb',
                              background:'#fff',
                              color:'#374151',
                              fontSize:13,
                              fontWeight:500,
                              cursor:'pointer',
                              transition:'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#f9fafb';
                              e.target.style.borderColor = '#d1d5db';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#fff';
                              e.target.style.borderColor = '#e5e7eb';
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
    </main>
  );
}
