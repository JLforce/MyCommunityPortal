// src/app/(protected)/layout.js

import React from 'react';
// Import your shared components for the authenticated area
import Header from '@/src/components/layout/Header';
import Sidebar from '@/src/components/layout/Sidebar';
import Footer from '@/src/components/layout/Footer'; 
// NOTE: Adjust the import paths based on where you place these components

/**
 * Layout component for all pages under the (protected) route group.
 * This layout will render the shared navigation and structure for logged-in users.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The specific page content (e.g., dashboard/page.js).
 */
export default function ProtectedLayout({ children }) {
  
  // You can fetch user session or profile data here if needed across the protected routes
  // For client components, you might use a hook like useAuth or a Context Provider

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 1. Sidebar/Navigation */}
      <Sidebar /> 
      
      <div className="flex flex-col flex-1">
        
        {/* 2. Header (e.g., containing user profile icon, notifications) */}
        <Header /> 
        
        {/* 3. Main Content Area */}
        <main className="flex-1 p-6 md:p-8">
          {children} 
        </main>
        
        {/* 4. Footer (optional for protected areas) */}
        <Footer /> 
        
      </div>
    </div>
  );
}