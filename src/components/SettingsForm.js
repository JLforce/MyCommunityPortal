// src/components/SettingsForm.js 
'use client';

import { useState, useEffect } from 'react';

export default function SettingsForm({ initialSettings }) {
  // Initialize state with the settings fetched on the server
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Update the component's state when prop changes (e.g., if page refresh is used)
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- FUNCTION TO HANDLE FORM SUBMISSION (PUT REQUEST) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings), // Send the entire state object
      });

      if (!response.ok) {
        throw new Error('Failed to save settings.');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings); // Update state with confirmed data from the server
      setMessage('Settings saved successfully! ✅');

    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg p-6 bg-white rounded-lg shadow">
      <h3 className="text-2xl font-semibold">Global Site Settings</h3>
      
      {/* Site Name Input */}
      <div>
        <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">Site Name</label>
        <input
          type="text"
          name="site_name"
          id="site_name"
          value={settings.site_name || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Contact Email Input */}
      <div>
        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">Contact Email</label>
        <input
          type="email"
          name="contact_email"
          id="contact_email"
          value={settings.contact_email || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Pickup Enabled Checkbox */}
      <div className="flex items-center">
        <input
          id="pickup_enabled"
          name="pickup_enabled"
          type="checkbox"
          checked={!!settings.pickup_enabled} // Convert value to boolean
          onChange={handleChange}
          className="h-4 w-4 text-green-600 border-gray-300 rounded"
        />
        <label htmlFor="pickup_enabled" className="ml-2 block text-sm text-gray-900">
          Enable Community Pickup Requests (Global Toggle)
        </label>
      </div>

      {/* Submission Status and Button */}
      <div className="flex justify-between items-center">
        {message && <p className={`text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      <p className="text-xs text-gray-500">Last Updated: {new Date(settings.update_at).toLocaleTimeString()}</p>
    </form>
  );
}