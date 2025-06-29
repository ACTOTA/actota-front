'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNavigation from '../navbar/BottomNavigation';

interface MobileLayoutWrapperProps {
  children: React.ReactNode;
}

const MobileLayoutWrapper: React.FC<MobileLayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Always show bottom navigation on mobile
  // Add extra padding on home page to account for both search bar and nav
  const isHomePage = pathname === '/';
  
  return (
    <>
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <BottomNavigation />
    </>
  );
};

export default MobileLayoutWrapper;