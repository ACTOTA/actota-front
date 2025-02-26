import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getAccountInfo(id: string): Promise<any> {
  try {
    const token = JSON.parse(localStorage.getItem('auth') || '{}')?.auth_token;
  

    const response = await actotaApi.get(`/api/account/${id}`,{ headers: {
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

export function useAccountInfo(id: string) {
  return useQuery({
    queryKey: ['accountInfo'],
    queryFn: () => getAccountInfo(id),
   
  });
}
