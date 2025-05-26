'use client';

import { Session, SessionUser } from "@/src/types/session";
import { useEffect, useState, useCallback } from 'react';

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

// Custom hook for session management
export const useSession = () => {
  const [session, setSession] = useState<Session>({ user: null, isLoggedIn: false });
  const [loading, setLoading] = useState(true);

  // Update session from client storage
  const refreshSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentSession = getClientSession();
      setSession(currentSession);
      setLoading(false);
    }
  }, []);

  // Save session data to localStorage
  const updateSession = useCallback((newSession: Session) => {
    if (typeof window !== 'undefined') {
      try {
        const { setLocalStorageItem, removeLocalStorageItem } = require('@/src/utils/browserStorage');
        
        if (newSession.user) {
          setLocalStorageItem('user', JSON.stringify(newSession.user));
          
          if (newSession.accessToken) {
            setLocalStorageItem('token', newSession.accessToken);
          }
        } else {
          // Clear session if user is null
          removeLocalStorageItem('user');
          removeLocalStorageItem('token');
        }
        
        setSession(newSession);
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }
  }, []);

  // Initialize session on component mount
  useEffect(() => {
    refreshSession();
    
    // Listen for storage events to keep session in sync across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user' || event.key === 'token') {
        refreshSession();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [refreshSession]);

  return {
    session,
    loading,
    updateSession,
    refreshSession
  };
};
