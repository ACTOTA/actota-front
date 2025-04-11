import { BookingType } from '@/src/components/models/Itinerary';
import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getBookings(): Promise<BookingType[]> {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(!user.user_id){
      throw new Error("Please login to view bookings");
    }

    const response = await actotaApi.get(`/api/account/${user?.user_id}/bookings`);
    return response.data;
   
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings(),
   
  });
}
