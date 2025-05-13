'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLogout } from '@/src/hooks/mutations/auth.mutation';

// List of admin emails that are allowed to access the admin panel
const ADMIN_EMAILS = ['test@gmail.com', 'tyler@actota.com'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    console.log('Checking admin authorization...');
    // Check if user is logged in and is an admin
    const checkAuth = async () => {
      try {
        // Get user from localStorage (this is how the app currently stores user data after login)
        const user = localStorage.getItem('user');
        
        if (user) {
          const userData = JSON.parse(user);
          setUserEmail(userData.email);
          
          // Check if the user's email is in the list of admin emails
          if (ADMIN_EMAILS.includes(userData.email)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            // Redirect to home if not an admin
            router.push('/');
          }
        } else {
          setIsAuthorized(false);
          // If not logged in, redirect to login
          router.push('/auth/signin?redirectTo=/admin');
        }
      } catch (error) {
        console.error('Error checking admin authorization:', error);
        setIsAuthorized(false);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/');
      }
    });
  };

  if (isAuthorized === null) {
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
        <p className="mb-6">You do not have permission to access the admin area.</p>
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
              <span className="text-gray-400 text-sm">
                {userEmail}
              </span>
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