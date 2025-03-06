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
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    //     if(!user.user_id){
    //       toast.error("Please login to view itinerary details");
    //       throw new Error("Please login to view itinerary details");
    //     }
    const response = await actotaApi.get(`/api/itineraries/${id}`);
    return response.data;
   
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export function useItineraryById(id: string) {
  return useQuery({
    queryKey: ['itineraryById', id],
    queryFn: () => fetchItineraryById(id),
    enabled: !!id,
   
  });
}
