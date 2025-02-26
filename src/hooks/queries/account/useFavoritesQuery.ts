import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getFavorites(): Promise<any> {
  try {
    const token = JSON.parse(localStorage.getItem('auth') || '{}')?.auth_token;
    const user = JSON.parse(localStorage.getItem('auth') || '{}')?.user;
  

    const response = await actotaApi.get(`/api/account/${user?.user_id}/favorites`,{ headers: {
        'Authorization': `Bearer ${token}`,
    }});
    console.log(response.data, "response from favorites");
    return response.data;
   
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(),
   
  });
}
