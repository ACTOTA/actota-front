import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getAccountInfo(id: string): Promise<any> {
  try {
  

    const response = await actotaApi.get(`/api/account/${id}`);
    console.log(response.data, "response from itinerary by id");
    return response.data;
   
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export function useAccountInfo(id: string) {
  return useQuery({
    queryKey: ['accountInfo'],
    queryFn: () => getAccountInfo(id),
   
  });
}
