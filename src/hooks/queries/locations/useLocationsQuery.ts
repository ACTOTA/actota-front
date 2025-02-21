import { useQuery } from '@tanstack/react-query';
import actotaApi from '@/src/lib/apiClient';

interface SearchParams {
  search: string;
  page?: number;
  limit?: number;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function searchLocations(params: SearchParams): Promise<SearchResponse> {
  // Convert params to URLSearchParams
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const response = await actotaApi.get(`/api/locations?${searchParams.toString()}`);
  return response.data;
}

export function useLocationsSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => searchLocations(params),
    enabled: !!params.search, // Only run query if search term exists
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

async function getAllLocations() {
  try {
    const response = await actotaApi.get('/api/locations');
    return response.data;
  } catch (error) {
    console.error('Error fetching getAllLocations:', error);
    throw error;
  }
}

export function useGetAllLocations() {
  return useQuery({
    queryKey: ['getAllLocations'],
    queryFn: getAllLocations,
  });
}
