"use client"
import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
// import { useAuth } from '@/src/hooks/useAuth';
interface Itinerary {
  // Define your activity type here
  id: string;
  // ... other fields
}

export async function fetchItineraryById(id: string): Promise<any> {
  try {

    console.log('Fetching itinerary with ID:', id);

    if (!id) {
      return null;
    }

    const response = await actotaApi.get(`/itineraries/${id}`);
    console.log('Response:', response);
    return response.data;

  } catch (error) {
    console.error('Fetch Error:', error);
    return null; // Return null instead of throwing to avoid hydration errors
  }
}

export function useItineraryById(id: string) {
  return useQuery({
    queryKey: ['itineraryById', id],
    queryFn: () => fetchItineraryById(id),
    enabled: !!id, // Only fetch if id is provided
  });
}
