import { useQuery } from '@tanstack/react-query';

interface SearchParams {
  locations?: string[];        // array of strings
  arrival_datetime?: string;   // ISO datetime string
  departure_datetime?: string; // ISO datetime string
  guests?: number[];           // array of numbers
  activities?: string[];       // array of strings
  adults?: number;             // optional number
  children?: number;           // optional number
  infants?: number;            // optional number
  lodging?: string[];          // optional array of strings
  transportation?: string;     // optional string
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
  return useQuery<SearchItinerariesResponse, Error>({
    queryKey: ['itineraries', 'search', searchParams],
    queryFn: () => searchItineraries(searchParams),
    enabled: !!Object.values(searchParams).some(value =>
      Array.isArray(value) ? value.length > 0 : !!value
    ),
    staleTime: 0, // Always consider data stale to prevent showing cached results
    refetchOnMount: true, // Always refetch when component mounts
  });
}
