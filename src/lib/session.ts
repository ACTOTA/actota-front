'use client';

import { Session, SessionUser } from "@/src/types/session";

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
