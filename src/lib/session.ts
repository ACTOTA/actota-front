'use client';

import { Session, SessionUser } from "@/src/types/session";
import axios from 'axios';

// Helper function to get session client-side (uses localStorage)
export const getClientSession = (): Session => {
  if (typeof window === 'undefined') {
    return { user: null, isLoggedIn: false };
  }

  try {
    // Use safe localStorage wrapper
    const { getLocalStorageItem } = require('@/src/utils/browserStorage');
    const userStr = getLocalStorageItem('user');
    if (!userStr) {
      return { user: null, isLoggedIn: false };
    }

    const user = JSON.parse(userStr);
    if (!user || !user.user_id) {
      return { user: null, isLoggedIn: false };
    }

    const token = getLocalStorageItem('token');

    return {
      user,
      isLoggedIn: true,
      accessToken: token || undefined
    };
  } catch (error) {
    console.error('Error getting client session:', error);
    return { user: null, isLoggedIn: false };
  }
};

// Check auth status with the server
export const validateSession = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/api/auth/validate-session');
    return response.status === 200;
  } catch (error) {
    console.error('Session validation failed:', error);
    // Clean up local storage if server says token is invalid
    const { removeLocalStorageItem } = require('@/src/utils/browserStorage');
    removeLocalStorageItem('user');
    
    // Also remove cookie by redirecting to a sign-out endpoint (can't delete cookies directly from client)
    await axios.post('/api/auth/signout');
    
    return false;
  }
};
