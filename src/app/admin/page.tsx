'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineUpload, HiOutlineViewGrid, HiOutlineCog, HiUserCircle, HiRefresh } from 'react-icons/hi';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Get user info from localStorage
    console.log('Getting admin info from localStorage...');
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setAdminUser(userData.email);
      }
    } catch (error) {
      console.error('Error getting admin info:', error);
    }

    // Check API connection
    checkApiConnection();
  }, [adminUser, apiStatus]);

  const checkApiConnection = async () => {
    try {
      console.log('Checking API connection...');
      const response = await fetch('http://localhost:8080/health', {
        method: 'GET',
      });

      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      console.error('API connection error:', error);
      setApiStatus('offline');
    }
  };

  return (
    <div className="min-h-screen-minus-header bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your featured itineraries and website content</p>
          </div>

          {adminUser && (
            <div className="mt-4 md:mt-0 bg-gray-900/60 px-4 py-2 rounded-full flex items-center">
              <HiUserCircle className="text-white mr-2 h-5 w-5" />
              <span className="text-sm text-gray-300">Logged in as: <span className="text-white">{adminUser}</span></span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Itinerary Uploader Card */}
          <Link href="/admin/itinerary-uploader">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 hover:bg-gray-800/60 transition-all duration-300 h-full">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                  <HiOutlineUpload className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Itinerary Uploader</h2>
              </div>
              <p className="text-gray-400 mb-4">Upload and manage featured vacation itineraries that will be displayed on the homepage.</p>
              <div className="text-blue-400 text-sm font-semibold flex items-center">
                Manage Itineraries
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Additional admin functionality cards could be added here */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 opacity-50 h-full">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                <HiOutlineViewGrid className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold">Content Management</h2>
            </div>
            <p className="text-gray-400 mb-4">Manage website content, including landing page elements and promotional materials.</p>
            <div className="text-purple-400 text-sm font-semibold flex items-center">
              Coming Soon
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 opacity-50 h-full">
            <div className="flex items-center mb-4">
              <div className="bg-green-500/20 p-3 rounded-full mr-4">
                <HiOutlineCog className="h-6 w-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold">System Settings</h2>
            </div>
            <p className="text-gray-400 mb-4">Configure system settings, user permissions, and integration parameters.</p>
            <div className="text-green-400 text-sm font-semibold flex items-center">
              Coming Soon
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-900/20 border border-blue-800/30 rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">API Connection Status</h3>
            <button
              onClick={checkApiConnection}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <HiRefresh className="mr-1" />
              Refresh Status
            </button>
          </div>
          <p className="text-gray-300 mb-4">Ensure that the backend API is running before using the admin features.</p>
          <div className="flex items-center">
            {apiStatus === 'checking' && (
              <>
                <span className="h-3 w-3 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-yellow-300">Checking connection...</span>
              </>
            )}
            {apiStatus === 'online' && (
              <>
                <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-400">API is online and ready to accept requests</span>
              </>
            )}
            {apiStatus === 'offline' && (
              <>
                <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                <span className="text-red-400">
                  API health check failed. Please ensure the backend server is running at localhost:8080.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}