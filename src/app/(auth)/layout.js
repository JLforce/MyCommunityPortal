// src/app/(auth)/layout.js
import React from 'react';

/**
 * Minimal layout for authentication pages (signin, signup, forgot-password).
 * It centers the content and removes the complex navigation/sidebar used in the protected area.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        {/* You can add your site logo here */}
        <h1 className="text-3xl font-bold text-center mb-8">MyCommunityPortal</h1>
        
        {/* The authentication form (children) will be placed inside this wrapper */}
        {children}
        
      </div>
    </div>
  );
}