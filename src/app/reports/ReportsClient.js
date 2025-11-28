"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import Link from 'next/link';

// Reports page: render only the right-side content (do NOT change header/footer/sidebar)
export default function ReportsClient({ user }) {
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  // Log user prop for debugging
  useEffect(() => {
    console.log('=== Reports Client: User Prop Received ===');
    console.log('User:', user);
    console.log('User ID:', user?.id);
    console.log('User Email:', user?.email);
    console.log('==========================================');
  }, [user]);

  // Fetch reports from Supabase on mount
  useEffect(() => {
    console.log('=== Reports Client: Fetch Reports Effect ===');
    console.log('User available:', !!user);
    console.log('User ID:', user?.id);
    
    // Only fetch reports if we have a user
    if (!user) {
      console.log('No user found, skipping report fetch');
      return;
    }

    const fetchReports = async () => {
      console.log('Fetching reports for user ID:', user.id);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id) // Filter reports by the current user's ID
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        console.log('Reports fetched successfully:', data?.length || 0, 'reports');
        setRecent(data || []);
      }
    };
    fetchReports();
  }, [user]); // Re-run this effect when the user prop changes

  // Upload photos to Supabase Storage
  const uploadPhotos = async (reportId, photoFiles) => {
    const uploadedUrls = [];
    for (const photoFile of photoFiles) {
      const filename = `${reportId}/${Date.now()}-${photoFile.name}`;
      const { data, error } = await supabase.storage
        .from('report-photos')
        .upload(filename, photoFile);
      if (error) {
        console.error('Error uploading photo:', error);
      } else {
        const { data: publicData } = supabase.storage
          .from('report-photos')
          .getPublicUrl(filename);
        uploadedUrls.push(publicData.publicUrl);
      }
    }
    return uploadedUrls;
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    const withPreview = selected.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setFiles(prev => [...prev, ...withPreview]);
  };

  const removeFile = (idx) => {
    setFiles(prev => {
      const next = prev.slice();
      try { URL.revokeObjectURL(next[idx].preview); } catch(e) {}
      next.splice(idx,1);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== Reports Client: Form Submit Started ===');
    console.log('User from prop:', user);
    console.log('User ID:', user?.id);

    if (!user) {
      console.error('=== ERROR: No user found for report submission ===');
      alert('You must be logged in to submit a report.');
      return;
    }

    console.log('Proceeding with report submission for user ID:', user.id);

    setLoading(true);
    
    try {
      // First, insert report to get ID
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .insert([
          {
            user_id: user.id,
            issue_type: issueType,
            priority,
            location,
            description,
            files: [],
          }
        ])
        .select('id');
      
      if (reportError) {
        alert('Error submitting report: ' + reportError.message);
        console.error(reportError);
        setLoading(false);
        return;
      }

      const reportId = reportData[0].id;

      // Upload photos if any
      let photoUrls = [];
      if (files.length > 0) {
        photoUrls = await uploadPhotos(reportId, files.map(f => f.file));
      }

      // Update report with photo URLs
      const { error: updateError } = await supabase
        .from('reports')
        .update({ files: photoUrls })
        .eq('id', reportId);

      if (updateError) {
        console.error('Error updating report with photos:', updateError);
      }

      alert('Report submitted successfully!');
      setIssueType(''); setPriority(''); setLocation(''); setDescription(''); setFiles([]);
      
      // Refetch reports for the current user
      const { data: newReports } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setRecent(newReports || []);
    } catch (err) {
      alert('Error: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatusPill = ({ children, color = 'green' }) => {
    const bg = color === 'green' ? '#dff6e6' : color === 'orange' ? '#fff3e0' : '#eef2ff';
    const text = color === 'green' ? 'var(--green-800)' : color === 'orange' ? '#b45309' : '#3730a3';
    return <span style={{ background: bg, color: text, padding: '6px 10px', borderRadius: 999, fontWeight: 700, fontSize: 13 }}>{children}</span>;
  };

  return (
    <main className="page-fade-in reports-page" style={{ padding: '28px 0' }}>
      <div className="container">
        <div className="reports-bg">
        {/* Page header (content area only) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: '0 0 6px' }}>Issue Reporting</h1>
            <p className="muted" style={{ margin: 0 }}>Report community issues and track their resolution</p>
          </div>
          <div>
            <Link href="#new-report" className="btn btn-primary" style={{ background: '#059669', borderRadius: 8, padding: '8px 12px' }}>+ New Report</Link>
          </div>
        </div>

  {/* Form card */}
  <div className="card reports-card" style={{ marginBottom: 18, padding: 20, background: '#F6FEF6' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, color: 'var(--green-900)' }}>Submit New Issue Report</h3>
          <p className="muted" style={{ margin: '0 0 12px' }}>Help keep our community clean and safe</p>

          <form id="new-report" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Issue Type</label>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)} style={{ width: '100%', padding: 12, height: 48, borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 15 }}>
                  <option value="">Select issue type</option>
                  <option value="illegal-dumping">Illegal Dumping</option>
                  <option value="missed-collection">Missed Collection</option>
                  <option value="overflowing-bin">Overflowing Bin</option>
                  <option value="damaged-bin">Damaged Bin</option>
                  <option value="hazardous-waste">Hazardous Waste</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Priority Level</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: 12, height: 48, borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 15 }}>
                  <option value="">Select priority</option>
                  <option value="low-non-urgent (">Low (Non-Urgent)</option>
                  <option value="medium-needs-attention">Medium (Needs Attention)</option>
                  <option value="high-urgent">High (Urgent)</option>
                  <option value="critical-emergency">Critical (Emergency)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Street address or landmark" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide detailed description of the issue..." rows={5} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #E5E7EB', resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Photo Evidence</label>
              <div style={{ padding: 16, borderRadius: 8, border: '1px dashed #E5E7EB', background: '#F9FFF4', textAlign: 'center' }}>
                <div style={{ marginBottom: 8 }} aria-hidden>
                  {/* cleaner camera icon */}
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="7" width="18" height="12" rx="2.2" stroke="#059669" strokeWidth="1.4" fill="#ECFDF5" />
                    <circle cx="12" cy="13" r="3.2" fill="#10B981" stroke="#0f766e" strokeWidth="0.6" />
                    <path d="M9 8.2L10 6.6a1 1 0 0 1 .9-.6h2.2c.4 0 .7.2.9.6l1 1.6" stroke="#059669" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ marginBottom: 8 }}>Upload photos of the issue</div>
                <input type="file" accept="image/*" multiple onChange={handleFiles} />

                {files.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    {files.map((f, idx) => (
                      <div key={idx} className="file-thumb" style={{ width: 96, height: 96, borderRadius: 8, overflow: 'hidden', position: 'relative', border: '1px solid #E5E7EB' }}>
                        <img src={f.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <button type="button" onClick={() => removeFile(idx)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 6px', cursor: 'pointer' }}>x</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
              <button type="submit" disabled={loading} style={{ flex: 1, background: loading ? '#ccc' : '#0b6b2c', color: '#fff', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Submitting...' : 'Submit Report'}</button>
              <button type="button" onClick={() => { setIssueType(''); setPriority(''); setLocation(''); setDescription(''); setFiles([]); }} style={{ padding: 12, borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff' }}>Cancel</button>
            </div>
          </form>
        </div>

        {/* Recent */}
        <div className="card reports-card" style={{ padding: 20, background: '#F6FEF6' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800, color: 'var(--green-900)' }}>Your Recent Reports</h3>
          <p className="muted" style={{ margin: '0 0 12px' }}>Track the status of your submitted issues</p>

          <div className="recent-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.length === 0 ? (
              <div className="muted">No reports found.</div>
            ) : (
              recent.map(r => (
                <div key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #E6F4EA' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                      <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: '#FEF3F2' }} aria-hidden>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 20h20L12 2z" fill="#FFEDD5" stroke="#fb923c" strokeWidth="1.2"/></svg>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{r.issue_type || r.title}</div>
                        <div className="muted" style={{ fontSize: 13 }}>{`Reported ${r.created_at ? new Date(r.created_at).toLocaleString() : ''} • ID: ${r.id} • ${r.location}`}</div>
                      </div>
                    </div>
                    <div>
                      {r.status === 'under-review' && <StatusPill color='orange'>Under Review</StatusPill>}
                      {r.status === 'in-progress' && <StatusPill color='yellow'>In Progress</StatusPill>}
                      {r.status === 'resolved' && <StatusPill color='green'>Resolved</StatusPill>}
                    </div>
                  </div>
                  {/* Display uploaded photos */}
                  {r.files && r.files.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {r.files.map((photoUrl, idx) => (
                        <div key={idx} style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                          <img src={photoUrl} alt={`report-photo-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ height: 36 }} />
        </div>
      </div>
    </main>
  );
}

