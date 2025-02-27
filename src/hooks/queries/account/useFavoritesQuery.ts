import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getFavorites(): Promise<any> {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  

    const response = await actotaApi.get(`/api/account/${user?.user_id}/favorites`);
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
