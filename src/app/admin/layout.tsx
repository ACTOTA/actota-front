'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLogout } from '@/src/hooks/mutations/auth.mutation';
import { useCurrentUserQuery } from '@/src/hooks/queries/auth/useCurrentUserQuery';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: currentUser, isLoading } = useCurrentUserQuery();

  useEffect(() => {
    console.log('Checking admin authorization...');
    
    // First check localStorage for faster access
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const userData = JSON.parse(localUser);
        setUserEmail(userData.email);
        
        // Check role from localStorage first
        if (userData.role === 'admin') {
          setUserRole(userData.role);
          setIsAuthorized(true);
          return;
        }
      } catch (error) {
        console.error('Error parsing local user data:', error);
      }
    }
    
    // If no local data or not admin, check server session
    if (!isLoading && currentUser) {
      console.log('Current user from session:', currentUser);
      setUserEmail(currentUser.email);
      setUserRole(currentUser.role);
      
      if (currentUser.role === 'admin') {
        setIsAuthorized(true);
        // Update localStorage with the latest data
        const localUser = localStorage.getItem('user');
        if (localUser) {
          try {
            const userData = JSON.parse(localUser);
            localStorage.setItem('user', JSON.stringify({
              ...userData,
              role: currentUser.role
            }));
          } catch (error) {
            console.error('Error updating localStorage:', error);
          }
        }
      } else {
        console.log('User role:', currentUser.role, '- not authorized');
        setIsAuthorized(false);
        router.push('/');
      }
    } else if (!isLoading && !currentUser) {
      // No session found, redirect to login
      setIsAuthorized(false);
      router.push('/auth/signin?redirectTo=/admin');
    }
  }, [currentUser, isLoading, router]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/');
      }
    });
  };

  if (isAuthorized === null || isLoading) {
    // Loading state
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (isAuthorized === false) {
    // Unauthorized state - this would redirect in the useEffect, 
    // but showing a message in case the redirect fails
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="mb-6">You do not have permission to access the admin area. This area requires admin role privileges.</p>
        <Link href="/" className="px-4 py-2 bg-white text-black rounded-full">
          Return to Homepage
        </Link>
      </div>
    );
  }

  // Authorized, render the admin layout
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Admin Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 py-3 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/admin">
              <Image src="/images/actota-logo.png" alt="ACTOTA Logo" width={100} height={20} />
            </Link>
            <span className="text-white px-2 py-1 rounded bg-red-600 text-xs font-bold">ADMIN</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/admin" className="text-white hover:text-gray-300 transition">
              Dashboard
            </Link>
            <Link href="/admin/itinerary-uploader" className="text-white hover:text-gray-300 transition">
              Itinerary Uploader
            </Link>
            {/* Add more admin navigation links as needed */}
          </nav>
          
          <div className="flex items-center space-x-4">
            {userEmail && (
              <div className="text-gray-400 text-sm">
                <span>{userEmail}</span>
                {userRole && (
                  <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">
                    {userRole.toUpperCase()}
                  </span>
                )}
              </div>
            )}
            <Link href="/" className="text-white text-sm hover:underline">
              Return to Site
            </Link>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-white text-sm bg-red-700 hover:bg-red-800 px-3 py-1 rounded-full transition-colors"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Admin Footer */}
      <footer className="bg-black py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          ACTOTA Admin Panel © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}