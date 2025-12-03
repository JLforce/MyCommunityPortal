// src/components/NotificationPanel.js 
'use client';

import { useState, useEffect } from 'react';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Fetch Notifications (GET Request) ---
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calls the internal Next.js API route handler: /api/notifications
      const response = await fetch('/api/notifications'); 
      if (!response.ok) {
        throw new Error('Failed to fetch notifications.');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (e) {
      setError(e.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Add a setInterval here to refresh notifications every 30 seconds
  }, []);

  // --- 2. Mark All Read (POST Request) ---
  const handleMarkAllRead = async () => {
    if (notifications.length === 0) return;

    // Get all unread IDs to send in the POST body
    const idsToMarkRead = notifications.map(n => n.id);

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToMarkRead }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read.');
      }

      // On successful update, clear the local state to reflect the change instantly
      setNotifications([]); 
      alert('All pending notifications marked as read.');
    } catch (e) {
      alert(`Error: Could not mark notifications read. ${e.message}`);
    }
  };


  // --- Render Logic ---
  return (
    <div className="notification-panel p-6 bg-white rounded-lg shadow-2xl max-w-md mx-auto my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button 
          onClick={handleMarkAllRead} 
          disabled={loading || notifications.length === 0}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {loading ? 'Loading...' : notifications.length > 0 ? 'Mark all read' : ''}
        </button>
      </div>

      {loading && <div className="text-center text-gray-500">Loading recent activity...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* Display List */}
      <div className="space-y-4">
        {notifications.length === 0 && !loading && (
          <p className="text-gray-500">You are all caught up! No new notifications.</p>
        )}
        
        {notifications.map(n => (
          <div key={n.id} className="border-b pb-2">
            <p className="font-semibold">{n.type || 'New Activity'}</p>
            <p className="text-sm text-gray-600">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}