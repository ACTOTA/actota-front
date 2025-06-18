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

interface PaginationParams {
  page?: number;
  limit?: number;
}

async function fetchItineraries(params?: PaginationParams): Promise<ItinerariesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const url = `/api/itineraries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch itineraries');
  }

  return response.json();
}

export function useItineraries(params?: PaginationParams) {
  return useQuery({
    queryKey: ['itineraries', params],
    queryFn: () => fetchItineraries(params),
  });
}
