import { BookingType } from '@/src/components/models/Itinerary';
import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getBookings(): Promise<BookingType[]> {
  try {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      // Server-side, return empty array to avoid localStorage errors
      return [];
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(!user.user_id){
      console.warn("User not logged in");
      return [];
    }

    const response = await actotaApi.get(`/api/account/${user?.user_id}/bookings`);
    return response.data;
   
  } catch (error) {
    console.error('Fetch Error:', error);
    return []; // Return empty array instead of throwing to avoid hydration errors
  }
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings(),
   
  });
}
