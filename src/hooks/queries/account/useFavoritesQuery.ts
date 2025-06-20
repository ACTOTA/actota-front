import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

async function getFavorites(): Promise<any> {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(!user.user_id){
      throw new Error("Please login to view favorites");
    }

    const response = await actotaApi.get(`/account/${user?.user_id}/favorites`);
    console.log("FAVORITES: ", response);
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
