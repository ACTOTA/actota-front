import { useQuery } from '@tanstack/react-query';

interface Itinerary {
  // Define your activity type here
  id: string;
  // ... other fields
}

interface ItinerariesResponse {
  success: boolean;
  message: string;
  data: any[];
}

async function fetchItineraries(): Promise<ItinerariesResponse> {
  const response = await fetch('/api/itineraries', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch itineraries');
  }

  return response.json();
}

export function useItineraries() {
  return useQuery({
    queryKey: ['itineraries'],
    queryFn: fetchItineraries,
  });
}
