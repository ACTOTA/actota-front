import actotaApi from '@/src/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

async function getAccountInfo(id: string): Promise<any> {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(!user.user_id){
      toast.error("Please login to view account info");
      throw new Error("Please login to view account info");
    }
    
    // Ensure we have a valid ID to avoid making requests to /api/account/ without an ID
    if (!id) {
      throw new Error("User ID is required");
    }
    
    const response = await actotaApi.get(`/api/account/${id}`);
    return response.data;
   
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export function useAccountInfo(id: string) {
  return useQuery({
    queryKey: ['accountInfo', id],
    queryFn: () => getAccountInfo(id),
    // Don't run the query if id is empty
    enabled: !!id
  });
}
