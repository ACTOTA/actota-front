'use client';

import { useEffect, useRef } from 'react';
import { validateSession } from '@/src/lib/session';
import { useRouter } from 'next/navigation';

// Constants
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const SESSION_CHECK_ACTIVITY_THRESHOLD = 30 * 60 * 1000; // Only check if user has been inactive for 30+ minutes

type UseSessionValidatorOptions = {
  enabled?: boolean;
  onInvalidSession?: () => void;
  checkInterval?: number;
};

/**
 * Hook to periodically validate user session and ensure auto-logout on inactivity
 */
export function useSessionValidator(options: UseSessionValidatorOptions = {}) {
  const {
    enabled = true,
    onInvalidSession,
    checkInterval = SESSION_CHECK_INTERVAL,
  } = options;
  
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle user activity tracking
  useEffect(() => {
    if (!enabled) return;
    
    const updateUserActivity = () => {
      lastActivityRef.current = Date.now();
    };
    
    // Track user activity
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateUserActivity);
    });
    
    // Set initial activity timestamp
    updateUserActivity();
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateUserActivity);
      });
    };
  }, [enabled]);
  
  // Handle session validation
  useEffect(() => {
    if (!enabled) return;
    
    const checkSession = async () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      // Only validate if user has been inactive for a while
      if (timeSinceLastActivity >= SESSION_CHECK_ACTIVITY_THRESHOLD) {
        const isValid = await validateSession();
        
        if (!isValid) {
          if (onInvalidSession) {
            onInvalidSession();
          } else {
            // Default behavior: redirect to login
            window.location.href = '/auth/signin';
          }
        }
      }
    };
    
    // Start periodic check
    checkTimerRef.current = setInterval(checkSession, checkInterval);
    
    // Run initial check
    checkSession();
    
    return () => {
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
      }
    };
  }, [enabled, onInvalidSession, checkInterval, router]);
}