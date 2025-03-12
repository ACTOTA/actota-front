'use client';

import { useEffect } from 'react';
import { useSessionValidator } from '@/src/hooks/useSessionValidator';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Component that handles session validation globally
 * Place this at the root layout to ensure session checking across the app
 */
export default function SessionChecker() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Check for inactivity and automatically log out after prolonged inactivity
  useSessionValidator({
    // Only enable for non-auth pages
    enabled: !pathname?.startsWith('/auth'),
    onInvalidSession: () => {
      // If on a protected page, redirect to login
      if (pathname?.startsWith('/profile')) {
        window.location.href = `/auth/signin?from=${pathname}&expired=true`;
      }
    },
  });
  
  return null; // This component doesn't render anything
}