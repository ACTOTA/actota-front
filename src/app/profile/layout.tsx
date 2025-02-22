'use client'
import React, { useState } from "react";
import Sidebar from "@/src/components/profileComponents/sidebar/Sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative flex max-w-[1280px] mx-auto pt-20">
      {/* Mobile Menu Button */}
      {!isSidebarOpen && <button 
        className="md:hidden absolute top-[70px] left-7 z-30 flex items-center gap-2 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg> Menu
      </button>}

      {/* Sidebar with responsive classes */}
      <div className={`
        md:relative md:translate-x-0 md:block bg-black
        fixed top-20 left-0 h-full z-20 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1  text-white p-8 relative">
    
        {children}
      </div>
    </div>
  );
}
