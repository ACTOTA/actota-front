import { useQuery } from '@tanstack/react-query';

interface Itinerary {
  // Define your activity type here
  id: string;
  // ... other fields
}

async function fetchItineraries(): Promise<any[]> {
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
