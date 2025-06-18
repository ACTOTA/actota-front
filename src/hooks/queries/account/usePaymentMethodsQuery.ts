import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

import { getClientSession } from '@/src/lib/session';

async function getPaymentMethods(): Promise<any> {
  try {
    // Only access session in browser environment
    let userId = '';
    if (typeof window !== 'undefined') {
      try {
        const session = getClientSession();
        if (!session.isLoggedIn || !session.user?.user_id) {
          // Fall back to localStorage for compatibility
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          userId = user.user_id;
          
          if (!userId) {
            throw new Error("Please login");
          }
        } else {
          userId = session.user.user_id;
        }
      } catch (error) {
        console.error('Error accessing session:', error);
        throw new Error("Please login");
      }
    } else {
      // Handle server-side case
      return []; // Return empty array or placeholder when on server
    }

    const response = await actotaApi.get(`/account/${userId}/payment-methods`);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => getPaymentMethods(),
    // Only run query on client-side
    enabled: typeof window !== 'undefined'
  });
}
