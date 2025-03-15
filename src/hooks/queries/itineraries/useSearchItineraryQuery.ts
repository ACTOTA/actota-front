import { useQuery } from '@tanstack/react-query';

interface SearchParams {
  location?: string;
  duration?: string;
  guests?: string;
  activities?: string;
}

interface SearchItinerariesResponse {
  success: boolean;
  message: string;
  data: any[];
}

async function searchItineraries(searchParams: SearchParams): Promise<SearchItinerariesResponse> {
  console.log('Sending search request with params:', searchParams);
  
  const response = await fetch('/api/itineraries/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchParams),
  });

  if (!response.ok) {
    throw new Error('Failed to search itineraries');
  }

  const result = await response.json();
  console.log('Search response received:', result);
  
  // Ensure data is always an array
  if (result.data && !Array.isArray(result.data)) {
    console.log('Converting data to array, original structure:', typeof result.data);
    result.data = result.data.data || result.data.results || [];
  }
  
  return result;
}

export function useSearchItineraries(searchParams: SearchParams) {
  return useQuery({
    queryKey: ['itineraries', 'search', searchParams],
    queryFn: () => searchItineraries(searchParams),
    enabled: !!Object.values(searchParams).some(value => !!value), // Only run if at least one search param is provided
  });
}