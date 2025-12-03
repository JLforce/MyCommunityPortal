// src/app/(protected)/layout.js

import React from 'react';
// Corrected imports using the new '@/components/' alias.
// NOTE: Ensure your components are named as imported (e.g., Sidebar.jsx)
import Header from '@/components/Header.jsx'; // Using the main Header (modify its content for auth state)
import Footer from '@/components/Footer.jsx'; 
import Sidebar from '@/components/Sidebar.jsx'; // Assuming you have a Sidebar component

/**
 * Layout component for all pages under the (protected) route group.
 */
export default function ProtectedLayout({ children }) {
  // You would typically wrap the content with an AuthProvider here if you
  // were using an Auth Context.

  return (
    // The main container includes the flex-direction: row for the Sidebar and content
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 1. Sidebar/Navigation */}
      <Sidebar /> 
      
      {/* The content wrapper handles the vertical flow of Header + Main Content */}
      <div className="flex flex-col flex-1">
        
        {/* 2. Header (Authenticated Header) */}
        <Header /> 
        
        {/* 3. Main Content Area */}
        <main className="flex-1 p-6 md:p-8">
          {children} 
        </main>
        
        {/* 4. Footer (Optional in protected area) */}
        <Footer /> 
        
      </div>
    </div>
  );
}