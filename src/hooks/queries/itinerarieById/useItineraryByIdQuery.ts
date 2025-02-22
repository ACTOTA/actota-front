import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
// import { useAuth } from '@/src/hooks/useAuth';
interface Itinerary {
  // Define your activity type here
  id: string;
  // ... other fields
}

async function fetchItineraryById(id: string): Promise<any> {
  try {
    const token = JSON.parse(localStorage.getItem('auth') || '{}')?.auth_token;
    // const { token } = useAuth();
    // const response = await fetch(`/api/itineraries/${id}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //   },
    //   // Add credentials if needed
    //   credentials: 'include',
    // });

    const response = await actotaApi.get(`/api/itineraries/${id}`,{ headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
    }});
    console.log(response.data, "response from itinerary by id");
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
