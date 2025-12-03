// src/app/(marketing)/layout.js

import React from 'react';
// Corrected imports using the new '@/components/' alias
import Header from '@/components/Header.jsx'; 
import Footer from '@/components/Footer.jsx'; 

/**
 * Layout component for public/marketing pages (e.g., '/', '/help-center').
 */
export default function MarketingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Header (Public Header - should show Sign In/Sign Up buttons) */}
      <Header /> 
      
      {/* 2. Main Content Area */}
      <main className="flex-1">
        {children} 
      </main>
      
      {/* 3. Footer (Site-wide footer) */}
      <Footer /> 
      
    </div>
  );
}