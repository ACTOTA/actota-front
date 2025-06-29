'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HomeIcon, MagnifyingGlassIcon, TicketIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, TicketIcon as TicketIconSolid, HeartIcon as HeartIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';
import { getAuthCookie, isTokenExpired } from '@/src/helpers/auth';
import { getLocalStorageItem } from '@/src/utils/browserStorage';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  href: string;
  requiresAuth?: boolean;
}

const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
      href: '/',
      requiresAuth: false
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: MagnifyingGlassIcon,
      activeIcon: MagnifyingGlassIconSolid,
      href: '/explore',
      requiresAuth: false
    },
    {
      id: 'bookings',
      label: 'Trips',
      icon: TicketIcon,
      activeIcon: TicketIconSolid,
      href: '/profile/bookings',
      requiresAuth: true
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: HeartIcon,
      activeIcon: HeartIconSolid,
      href: '/profile/favorites',
      requiresAuth: true
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserIcon,
      activeIcon: UserIconSolid,
      href: '/profile',
      requiresAuth: true
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAuthCookie();
        if (token) {
          const isExpired = await isTokenExpired(token);
          setIsAuthenticated(!isExpired);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleNavigation = (href: string, requiresAuth?: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      router.push('/auth/signin');
    } else {
      router.push(href);
    }
  };

  const visibleNavItems = navItems.filter(item => !item.requiresAuth || isAuthenticated);

  // Don't show on desktop
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800/50 md:hidden z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href, item.requiresAuth)}
              className="flex flex-col items-center justify-center flex-1 py-2 px-1 group relative"
            >
              <Icon 
                className={`w-6 h-6 mb-0.5 transition-all duration-200 ${
                  isActive 
                    ? 'text-yellow-400 scale-110' 
                    : 'text-gray-400 group-active:scale-95'
                }`} 
              />
              <span 
                className={`text-[10px] transition-all duration-200 ${
                  isActive 
                    ? 'text-yellow-400 font-semibold' 
                    : 'text-gray-400 font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;