'use client';

import { Session, SessionUser } from "@/src/types/session";

// Helper function to get session client-side (uses localStorage)
export const getClientSession = (): Session => {
  if (typeof window === 'undefined') {
    return { user: null, isLoggedIn: false };
  }

  try {
    // Use safe localStorage wrapper
    const { getLocalStorageItem, setLocalStorageItem } = require('@/src/utils/browserStorage');
    const userStr = getLocalStorageItem('user');
    if (!userStr) {
      return { user: null, isLoggedIn: false };
    }

    const user = JSON.parse(userStr);
    console.log('Got user from localStorage:', JSON.stringify(user, null, 2));
    
    if (!user || !user.user_id) {
      return { user: null, isLoggedIn: false };
    }

    const token = getLocalStorageItem('token');
    
    // If user exists but doesn't have customer_id, let's try to fetch it
    if (user.user_id && !user.customer_id) {
      console.log('No customer_id found, will fetch from API');
      // We need to use setTimeout to avoid blocking and allow async operation
      setTimeout(async () => {
        try {
          // Use fetch directly to call our Next.js API route
          const response = await fetch(`/api/account/${user.user_id}/customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const responseData = await response.json();
          
          if (responseData && responseData.customer_id) {
            console.log('Fetched customer_id:', responseData.customer_id);
            user.customer_id = responseData.customer_id;
            setLocalStorageItem('user', JSON.stringify(user));
            console.log('Updated user in localStorage with customer_id');
          }
        } catch (fetchError) {
          console.error('Failed to fetch customer_id:', fetchError);
        }
      }, 0);
    }

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
