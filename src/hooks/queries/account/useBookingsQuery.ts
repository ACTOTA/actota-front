import { BookingType } from '@/src/components/models/Itinerary';
import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getBookings(): Promise<BookingType[]> {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.user_id) {
      console.warn("User not logged in");
      return [];
    }
    const response = await actotaApi.get(`/account/${user.user_id}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
}

async function getBookingById(id: string): Promise<BookingType | null> {
  try {
    if (!id) return null;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.user_id) {
      console.warn("User not logged in");
      return null;
    }
    const response = await actotaApi.get(`/account/${user.user_id}/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
}

export function useBookings() {
  return useQuery<BookingType[]>({
    queryKey: ['bookings'],
    queryFn: () => getBookings(),
  });
}

export function useBookingById(id: string) {
  return useQuery<BookingType | null>({
    queryKey: ['bookingsById', id],
    queryFn: () => getBookingById(id),
    enabled: !!id, // Only fetch if id is provided
  });
}