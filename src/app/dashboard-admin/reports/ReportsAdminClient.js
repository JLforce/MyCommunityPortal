"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/supabase';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function ReportsAdminClient({ user }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminProfile, setAdminProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch all reports with resident information
  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setProfileError('You must be signed in to view reports.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setProfileError('');
      
      try {
        // 0. Verify session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          setProfileError('Session expired. Please sign in again.');
          setLoading(false);
          return;
        }

        console.log('=== Reports Admin: Fetching Data ===');
        console.log('User ID:', user.id);
        console.log('Has session:', !!session);

        // 1. Fetch the logged-in admin's profile to get their municipality
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('municipality, role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching admin profile:', profileError);
          setProfileError(`Error loading profile: ${profileError.message}`);
          setReports([]);
          setFilteredReports([]);
          setLoading(false);
          return;
        }

        if (!profile) {
          console.error('Admin profile not found');
          setProfileError('Profile not found. Please complete your profile setup.');
          setReports([]);
          setFilteredReports([]);
          setLoading(false);
          return;
        }

        if (!profile.municipality) {
          console.error('Municipality not set in admin profile');
          setProfileError('Your profile is missing a municipality. Update your profile to view reports.');
          setReports([]);
          setFilteredReports([]);
          setLoading(false);
          return;
        }

        console.log('Admin municipality:', profile.municipality);
        setAdminProfile(profile);
        const adminMunicipality = profile.municipality;

        // 2. Fetch reports scoped to the admin's municipality
        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .eq('municipality', adminMunicipality)
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error('Error fetching reports:', reportsError);
          setProfileError(`Error loading reports: ${reportsError.message}`);
          setReports([]);
          setFilteredReports([]);
          setLoading(false);
          return;
        }

        console.log(`Fetched ${reportsData?.length || 0} reports for municipality: ${adminMunicipality}`);

        // 3. Fetch resident profiles for those reports (no FK join defined in DB)
        const residentIds = Array.from(new Set((reportsData || []).map(r => r.user_id).filter(Boolean)));
        let profilesMap = new Map();

        if (residentIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, municipality, phone, email')
            .in('id', residentIds);

          if (profilesError) {
            console.error('Error fetching resident profiles:', profilesError);
          } else {
            profilesMap = new Map((profilesData || []).map(p => [p.id, p]));
            console.log(`Fetched ${profilesData?.length || 0} resident profiles`);
          }
        }

        const transformedReports = (reportsData || []).map(report => {
          const residentProfile = profilesMap.get(report.user_id);
          const residentName = residentProfile
            ? `${residentProfile.first_name || ''} ${residentProfile.last_name || ''}`.trim() || residentProfile.email || 'Unknown User'
            : 'Unknown User';
        
          return {
            ...report,
            residentName
          };
        });

        console.log('Transformed reports:', transformedReports.length);
        setReports(transformedReports);
        setFilteredReports(transformedReports);
      } catch (error) {
        console.error('Unexpected error:', error);
        setProfileError(`Unable to load reports: ${error.message || 'Please try again.'}`);
        setReports([]);
        setFilteredReports([]);
      } finally {
        setLoading(false);
        console.log('=== Reports Admin: Fetch Complete ===');
      }
    };

    fetchReports();
  }, [user]); // Rerun if the user object changes

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


  // Handle opening report details dialog
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
    setUpdateError('');
    setUpdateSuccess(false);
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null);
    setUpdateError('');
    setUpdateSuccess(false);
  };

  // Handle updating report
  const handleUpdateReport = async (updatedData) => {
    if (!selectedReport) return;

    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      const { error } = await supabase
        .from('reports')
        .update(updatedData)
        .eq('id', selectedReport.id);

      if (error) {
        throw error;
      }

      // Update the report in local state
      const updatedReports = reports.map(r => 
        r.id === selectedReport.id ? { ...r, ...updatedData } : r
      );
      setReports(updatedReports);
      
      // Update filtered reports
      const updatedFiltered = filteredReports.map(r => 
        r.id === selectedReport.id ? { ...r, ...updatedData } : r
      );
      setFilteredReports(updatedFiltered);

      // Update selected report
      setSelectedReport({ ...selectedReport, ...updatedData });
      setUpdateSuccess(true);
      
      // Clear success message after 2 seconds
      setTimeout(() => setUpdateSuccess(false), 2000);
    } catch (error) {
      console.error('Error updating report:', error);
      setUpdateError(error.message || 'Failed to update report. Please try again.');
    } finally {
      setUpdateLoading(false);
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

          {profileError && (
            <div style={{marginBottom:16,padding:12,borderRadius:8,border:'1px solid #fecdd3',background:'#fff1f2',color:'#b91c1c',fontWeight:600}}>
              {profileError}
            </div>
          )}

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

          {/* Reports Grid - 3 columns */}
          {loading ? (
            <div style={{padding:40,textAlign:'center',color:'#6b7280'}}>Loading reports...</div>
          ) : filteredReports.length === 0 ? (
            <div style={{padding:40,textAlign:'center',color:'#6b7280'}}>No reports found.</div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:20}}>
              {filteredReports.map((report) => {
                const statusBadge = getStatusBadge(report.status);
                const priorityBadge = getPriorityBadge(report.priority);
                
                return (
                  <div
                    key={report.id}
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
                        <span style={{
                          width:6,
                          height:6,
                          borderRadius:'50%',
                          background:statusBadge.dotColor,
                          display:'inline-block'
                        }}></span>
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Report Type */}
                    <div style={{fontSize:18,fontWeight:700,color:'#111827',paddingRight:100}}>
                      {formatReportType(report.issue_type)}
                    </div>

                    {/* Resident Name */}
                    <div style={{fontSize:15,color:'#374151',fontWeight:500}}>
                      {report.residentName}
                    </div>

                    {/* Date */}
                    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#6b7280'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{formatDate(report.created_at)}</span>
                    </div>

                   {/* Location 
                    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#6b7280'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{wordBreak:'break-word'}}>{formatLocation(report.location)}</span>
                    </div>*/}

                    {/* Description */}
                      <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#6b7280'}}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 20h.01M8 4h8l1 9H7l1-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{wordBreak:'break-word'}}>{report.description || "No description provided."}</span>
                      </div>

                    {/* Priority */}
                    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14}}>
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
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewReport(report)}
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

          {/* Report Details Dialog */}
          {isDialogOpen && selectedReport && (
            <ReportDetailsDialog
              report={selectedReport}
              onClose={handleCloseDialog}
              onUpdate={handleUpdateReport}
              updateLoading={updateLoading}
              updateError={updateError}
              updateSuccess={updateSuccess}
            />
          )}
    </main>
  );
}

// Report Details Dialog Component
function ReportDetailsDialog({ report, onClose, onUpdate, updateLoading, updateError, updateSuccess }) {
  const [status, setStatus] = useState(report.status || 'pending');
  const [priority, setPriority] = useState(report.priority || 'low-non-urgent');
  const coords = extractCoordinates(report.location);
  const mapCenter = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854]; // Default to Cebu City

  const statusBadge = getStatusBadge(status);
  const priorityBadge = getPriorityBadge(priority);

  const handleSave = () => {
    onUpdate({
      status,
      priority
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 1400,
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 900,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 18px 60px rgba(2,6,23,0.24)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '22px 22px 14px',
          borderBottom: '1px solid #eef2f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                {formatReportType(report.issue_type)}
              </h2>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 999,
                background: statusBadge.bg,
                color: statusBadge.color,
                fontSize: 13,
                fontWeight: 700
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: statusBadge.dotColor,
                  display: 'inline-block'
                }}></span>
                {statusBadge.text}
              </span>
            </div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Report ID: {report.id}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1,
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
          {/* Report Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <Detail label="Resident" value={report.residentName} />
            <Detail label="Report Type" value={formatReportType(report.issue_type)} />
            <Detail label="Priority" value={
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: 999,
                background: priorityBadge.bg,
                color: priorityBadge.color,
                fontSize: 12,
                fontWeight: 600
              }}>
                {priorityBadge.text}
              </span>
            } />
            <Detail label="Date Reported" value={formatDate(report.created_at)} />
           {/* <Detail label="Location" value={formatLocation(report.location)} />*/}
            <Detail label="Municipality" value={report.municipality || 'N/A'} />
          </div>

          {/* Description */}
          {report.description && (
            <div style={{ padding: 14, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Description</div>
              <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {report.description}
              </div>
            </div>
          )}

          {/* Map */}
          {coords && (
            <div style={{ padding: 14, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Location on Map</div>
              <div style={{ width: '100%', height: 300, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup>
                      Report Location<br />
                      ({coords.lat.toFixed(6)}, {coords.lng.toFixed(6)})
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </div>
            </div>
          )}

          {/* Photos */}
          {report.files && report.files.length > 0 && (
            <div style={{ padding: 14, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Photo Evidence</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {report.files.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open(photoUrl, '_blank')}
                  >
                    <img
                      src={photoUrl}
                      alt={`Report photo ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Update Form */}
          <div style={{ padding: 14, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Update Report</div>
            
            {updateError && (
              <div style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 8,
                border: '1px solid #fecdd3',
                background: '#fff1f2',
                color: '#b91c1c',
                fontSize: 13
              }}>
                {updateError}
              </div>
            )}

            {updateSuccess && (
              <div style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 8,
                border: '1px solid #86efac',
                background: '#f0fdf4',
                color: '#166534',
                fontSize: 13
              }}>
                Report updated successfully!
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 14,
                    background: '#fff',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 14,
                    background: '#fff',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="low-non-urgent">Low (Non-Urgent)</option>
                  <option value="medium-needs-attention">Medium (Needs Attention)</option>
                  <option value="high-urgent">High (Urgent)</option>
                  <option value="critical-emergency">Critical (Emergency)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px 20px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          borderTop: '1px solid #eef2f7',
          position: 'sticky',
          bottom: 0,
          background: '#fff',
          zIndex: 10
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#fff',
              border: '1px solid #d1fae5',
              color: '#065f46',
              padding: '10px 16px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={updateLoading}
            style={{
              background: updateLoading ? '#9ca3af' : '#065f46',
              border: 'none',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: 10,
              fontWeight: 800,
              boxShadow: '0 12px 24px rgba(6,95,46,0.18)',
              cursor: updateLoading ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            {updateLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions (accessible to both component and dialog)

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Format report type for display
function formatReportType(type) {
  if (!type) return 'Other Issues';
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format location - extract address if coordinates are present
function formatLocation(location) {
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
}

// Extract coordinates from location string
function extractCoordinates(location) {
  if (!location) return null;
  
  const coordMatch = location.match(/lat:\s*([-\d.]+),\s*lng:\s*([-\d.]+)/);
  if (coordMatch) {
    return {
      lat: parseFloat(coordMatch[1]),
      lng: parseFloat(coordMatch[2])
    };
  }
  return null;
}

// Get status badge styling
function getStatusBadge(status) {
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
    const isUnderReview = statusLower === 'under-review' || statusLower === 'under_review';
    return {
      bg: '#fee2e2',
      color: '#991b1b',
      dotColor: '#ef4444',
      text: isUnderReview ? 'Under Review' : 'Pending'
    };
  }
}

// Get priority badge styling
function getPriorityBadge(priority) {
  const priorityLower = (priority || 'low').toLowerCase();
  
  if (priorityLower.includes('high') || priorityLower.includes('urgent') || priorityLower.includes('critical')) {
    return { bg: '#fee2e2', color: '#991b1b', text: 'high' };
  } else if (priorityLower.includes('medium')) {
    return { bg: '#fff3e0', color: '#b45309', text: 'medium' };
  } else {
    return { bg: '#dff6e6', color: '#065f46', text: 'low' };
  }
}

// Detail component
function Detail({ label, value }) {
  return (
    <div style={{ padding: 14, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff' }}>
      <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, color: '#111827', fontWeight: 600, lineHeight: 1.4 }}>
        {value || '—'}
      </div>
    </div>
  );
}
