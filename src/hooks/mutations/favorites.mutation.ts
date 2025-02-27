import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import actotaApi from '@/src/lib/apiClient';


// Subscribe mutation
const useAddFavorites = () => {
  return useMutation({
    mutationFn: async (favoriteId: string) => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
            const response = await actotaApi.post(
          `/api/account/${user?.user_id}/favorites/${favoriteId}`,
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
};


const useRemoveFavorites = () => {
    return useMutation({
      mutationFn: async (favoriteId: string) => {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
              const response = await actotaApi.delete(
            `/api/account/${user?.user_id}/favorites/${favoriteId}`,
           
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
  };

export { useAddFavorites, useRemoveFavorites };
  