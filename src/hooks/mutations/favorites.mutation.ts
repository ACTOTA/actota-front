import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import actotaApi from '@/src/lib/apiClient';


// Subscribe mutation
const useAddFavorites = () => {
  return useMutation({
    mutationFn: async (favoriteId: string) => {
      try {
        const token = JSON.parse(localStorage.getItem('auth') || '{}')?.auth_token;
        const user = JSON.parse(localStorage.getItem('auth') || '{}')?.user;
        console.log(token, "token");
            const response = await actotaApi.post(
          `/api/account/${user?.user_id}/favorites/${favoriteId}`,
          {},
          {
             headers: {
            'Authorization': `Bearer ${token}`,
          }}
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
          const token = JSON.parse(localStorage.getItem('auth') || '{}')?.auth_token;
          const user = JSON.parse(localStorage.getItem('auth') || '{}')?.user;
          console.log(token, "token");
              const response = await actotaApi.delete(
            `/api/account/${user?.user_id}/favorites/${favoriteId}`,
            {
               headers: {
              'Authorization': `Bearer ${token}`,
            }}
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
  