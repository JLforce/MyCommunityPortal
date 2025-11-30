"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/supabase';
import Brand from '../../../components/Brand';
import HeaderButtons from '../../../components/HeaderButtons';
import Link from 'next/link';

export default function ReportsAdminClient({ user }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all reports with resident information
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Fetch all reports
        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error('Error fetching reports:', reportsError);
          setLoading(false);
          return;
        }

        if (!reportsData || reportsData.length === 0) {
          setReports([]);
          setFilteredReports([]);
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

            <Link href="/dashboard-admin/reports" className="nav-link active" style={{display:'flex',alignItems:'center',gap:12,padding:'14px 20px',borderRadius:10,background:'var(--green-900)',color:'#fff',fontSize:18,fontWeight:800}}>
              <div className="nav-icon nav-icon--reports">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 3h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3z" fill="#ffffff" />
                  <rect x="9" y="8" width="6" height="1.6" rx="0.8" fill="#fff" opacity="0.9" />
                </svg>
              </div>
              <span>Reports</span>
            </Link>

            <Link href="/pickup" className="nav-link" style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:8,fontSize:17,fontWeight:600}}>
              <div className="nav-icon nav-icon--pickup">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="8" width="12" height="6" rx="1" fill="#1e3a8a" />
                  <rect x="15" y="9" width="5" height="3" rx="0.8" fill="#1e3a8a" />
                  <circle cx="8" cy="17" r="1.4" fill="#fff" />
                  <circle cx="18" cy="17" r="1.4" fill="#fff" />
                </svg>
              </div>
              Pickups
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
              <h1 style={{margin:'0 0 6px',fontSize:32,fontWeight:800,color:'#111827'}}>Reports</h1>
              <p style={{margin:0,fontSize:16,color:'#6b7280'}}>Manage and monitor community waste management.</p>
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
      </div>
    </div>
  );
}

