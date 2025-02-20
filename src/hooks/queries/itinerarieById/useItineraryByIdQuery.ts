import { useQuery } from '@tanstack/react-query';

interface Itinerary {
  // Define your activity type here
  id: string;
  // ... other fields
}

async function fetchItineraryById(id: string): Promise<any> {
  try {
    const response = await fetch(`/api/itineraries/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add credentials if needed
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); // First get the response as text
    console.log('Raw response:', text); // Log the raw response

    try {
      const data = JSON.parse(text); // Then try to parse it as JSON
      return data;
    } catch (e) {
      console.error('JSON Parse Error:', e);
      throw new Error('Invalid JSON response from server');
    }
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
    retry: false, // Don't retry on failure
    onError: (error) => {
      console.error('Query error:', error);
    },
  });
}
