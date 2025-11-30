// src/app/(marketing)/layout.js

import React from 'react';
// Import your site-wide components
// NOTE: We assume you have a Header and Footer component in src/components
import Header from '@/src/components/Header'; 
import Footer from '@/src/components/Footer'; 
// If your components are nested (e.g., src/components/layout/Header), adjust the path accordingly.

/**
 * Layout component for public/marketing pages (e.g., '/', '/help-center').
 * This provides a simple, standard header and footer wrapper.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The specific page content (e.g., page.js).
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