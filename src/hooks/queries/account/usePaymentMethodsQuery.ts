import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getPaymentMethods(): Promise<any> {
  try {
    // Only access localStorage in browser environment
    let userId = '';
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      userId = user.user_id;

      if (!userId) {
        throw new Error("Please login");
      }
    } else {
      // Handle server-side case
      return []; // Return empty array or placeholder when on server
    }

    const response = await actotaApi.get(`/api/account/${userId}/payment-methods`);
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
