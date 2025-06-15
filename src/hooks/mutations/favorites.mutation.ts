import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import actotaApi from '@/src/lib/apiClient';
import { toast } from 'react-hot-toast';

// Subscribe mutation
const useAddFavorites = () => {
  const mutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if(!user.user_id){
          toast.error("Please login to add favorites");
          throw new Error("Please login to add favorites");
        }
            const response = await actotaApi.post(
          `/account/${user?.user_id}/favorites/${favoriteId}`,
          {},
         
        );
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onError: (error) => {
      console.error('use add favorites error:', error);
    },
  });

  return { ...mutation, isLoading: mutation.isPending };
};


const useRemoveFavorites = () => {
    const mutation = useMutation({
      mutationFn: async (favoriteId: string) => {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if(!user.user_id){
            toast.error("Please login to remove favorites");
            throw new Error("Please login to remove favorites");
          }
              const response = await actotaApi.delete(
            `/account/${user?.user_id}/favorites/${favoriteId}`,
           
          );
          return response.data;
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      onError: (error) => {
        console.error('use remove favorites error:', error);
      },
    });

    return { ...mutation, isLoading: mutation.isPending };
  };

export { useAddFavorites, useRemoveFavorites };
  