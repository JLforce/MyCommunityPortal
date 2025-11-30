// top-level imports
"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase/supabase';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import imageCompression from 'browser-image-compression';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Reports page: render only the right-side content (do NOT change header/footer/sidebar)
export default function ReportsClient({ user }) {
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [coords, setCoords] = useState(null); // Track map pin (lat/lng)
  const [userLocation, setUserLocation] = useState(null); // User's current location
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [showCamera, setShowCamera] = useState(false);
  const [mapCenter, setMapCenter] = useState([10.3157, 123.8854]); // Default to Cebu City

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

  // Request user's location permission
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setLocationPermission('denied');
      return;
    }

    setLocationPermission('prompt');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userCoords = { lat: latitude, lng: longitude };
        setUserLocation(userCoords);
        setMapCenter([latitude, longitude]);
        setLocationPermission('granted');
        // Optionally auto-set the pin to user's location
        setCoords(userCoords);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission('denied');
        if (error.code === error.PERMISSION_DENIED) {
          alert('Location permission denied. You can still manually pin a location on the map.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Location information unavailable. You can still manually pin a location on the map.');
        } else {
          alert('Error getting location. You can still manually pin a location on the map.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Request user's camera permission
  const requestCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera is not supported by your browser.');
      setCameraPermission('denied');
      return false;
    }

    try {
      // Request video stream to trigger permission prompt
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // We have permission, stop the stream immediately as we only need it for the prompt
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      console.log('Camera permission granted.');
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Camera permission denied. You can enable it in your browser settings to take a picture.');
      } else {
        alert('Could not access the camera. Please ensure it is not in use by another application.');
      }
      setCameraPermission('denied');
      return false;
    }
  };


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

  const handleFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        try {
          const compressedFile = await imageCompression(file, options);
          console.log(`Compressed ${file.name} from ${file.size / 1024} KB to ${compressedFile.size / 1024} KB`);
          return { file: compressedFile, preview: URL.createObjectURL(compressedFile) };
        } catch (error) {
          console.error('Error compressing image:', error);
          // Fallback to original file if compression fails
          return { file, preview: URL.createObjectURL(file) };
        }
      })
    );

    setFiles(prev => [...prev, ...compressedFiles]);
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
      // Combine typed location and pinned coords for storage
      const locationString = coords
        ? (location ? `${location} (lat: ${coords.lat}, lng: ${coords.lng})` : `lat: ${coords.lat}, lng: ${coords.lng}`)
        : location;
  
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .insert([
          {
            user_id: user.id,
            issue_type: issueType,
            priority,
            location: locationString,
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

      // inside handleSubmit (after successful submission and resets)
      alert('Report submitted successfully!');
      setIssueType(''); setPriority(''); setLocation(''); setDescription(''); setFiles([]); setCoords(null);
      // Reset map center to default if needed
      if (userLocation) {
        setMapCenter([userLocation.lat, userLocation.lng]);
      } else {
        setMapCenter([10.3157, 123.8854]); // Cebu City fallback
      }
      
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

           {/* <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street address or landmark"
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
              />
            </div>*/}

            {/* Map: click to place a pin */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ display: 'block', fontWeight: 700, margin: 0 }}>Pin Location on Map</label>
                <button
                  type="button"
                  onClick={requestLocation}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid #059669',
                    background: locationPermission === 'granted' ? '#ECFDF5' : '#fff',
                    color: '#059669',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                  </svg>
                  {locationPermission === 'granted' ? 'Location Found' : 'Use My Location'}
                </button>
              </div>
              <div style={{ width: '100%', height: 300, borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB', position: 'relative' }}>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    key={`${mapCenter[0]}-${mapCenter[1]}`} // Force re-render when center changes
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <MapCenter center={mapCenter} />
                    <LocationPicker onPick={setCoords} />
                    {(coords || userLocation) && (
                        <Marker
                            position={[
                                (coords ? coords : userLocation).lat,
                                (coords ? coords : userLocation).lng
                            ]}
                        >
                            <Popup>
                                {coords
                                    ? <>Selected location<br />({coords.lat.toFixed(6)}, {coords.lng.toFixed(6)})</>
                                    : 'Your current location'}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                Click "Use My Location" to center the map on your device, or click anywhere on the map to drop a pin.
              </div>
              {coords && (
                <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: '#059669' }}>
                  Selected: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </div>
              )}
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
                {/*<input type="file" accept="image/*" multiple onChange={handleFiles} />*/}
                {/*<div style={{ marginBottom: 12 }}>Upload photos or take a picture</div>*/}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
  {/* Upload File */}
  <label
    className="btn"
    style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      padding: '8px 16px',
      borderRadius: 8,
      cursor: 'pointer'
    }}
  >
    Upload Files
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleFiles}
      style={{ display: 'none' }}
    />
  </label>

  {/* Take Photo */}
  <button
    type="button"
    className="btn btn-primary"
    style={{
      background: '#059669',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: 8,
      cursor: 'pointer',
      border: 'none',
      fontSize: 'inherit',
      fontFamily: 'inherit'
    }}
    onClick={async () => {
      if (cameraPermission !== 'granted') {
        const permissionGranted = await requestCameraPermission();
        if (!permissionGranted) {
          return; // Stop if permission is denied
        }
      }
      // Open the custom camera modal
      setShowCamera(true);
    }}
  >
    Take a Picture
  </button>
</div>


                {/* This input is now hidden and replaced by styled labels */}
                {/* <input type="file" accept="image/*" multiple onChange={handleFiles} /> */}

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

            {showCamera && (
              <CameraModal
                onClose={() => setShowCamera(false)}
                onCapture={async (imageFile) => {
                  // Reuse the handleFiles logic for compression and state update
                  const event = { target: { files: [imageFile] } };
                  await handleFiles(event);
                  setShowCamera(false); // Close camera after capture
                }}
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
              <button type="submit" disabled={loading} style={{ flex: 1, background: loading ? '#ccc' : '#0b6b2c', color: '#fff', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Submitting...' : 'Submit Report'}</button>
              <button
                type="button"
                onClick={() => { 
                  setIssueType(''); 
                  setPriority(''); 
                  setLocation(''); 
                  setDescription(''); 
                  setFiles([]); 
                  setCoords(null);
                  // Reset map center
                  if (userLocation) {
                    setMapCenter([userLocation.lat, userLocation.lng]);
                  } else {
                    setMapCenter([14.5995, 120.9842]);
                  }
                }}
                style={{ padding: 12, borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff' }}
              >
                Cancel
              </button>
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

// Component to center map when center prop changes
function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Capture clicks on the map to set pin
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Custom Camera Modal Component
function CameraModal({ onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    // Start camera stream
    let activeStream;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        activeStream = stream;
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please ensure you have granted permission and it's not in use.");
        onClose();
      });

    // Cleanup: stop stream when component unmounts
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      // Stop the video stream after capture
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Restart the stream
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(newStream => {
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      });
  };

  const handleConfirm = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(blob => {
        const imageFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(imageFile);
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: '#111', padding: 16, borderRadius: 12, width: '100%', maxWidth: 600, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '100%', marginBottom: 16 }}>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%', borderRadius: 8 }} />
          ) : (
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 8 }} />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          {capturedImage ? (
            <>
              <button type="button" onClick={handleRetake} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 16 }}>Retake</button>
              <button type="button" onClick={handleConfirm} style={{ padding: '12px 20px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 16 }}>Use Photo</button>
            </>
          ) : (
            <button type="button" onClick={handleCapture} style={{ padding: '12px 20px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 16 }}>Capture</button>
          )}
        </div>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18 }}>
          &times;
        </button>
      </div>
    </div>
  );
}
