import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthResponse } from '@/src/types/mutations/auth';

export const useAuth = () => {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  // const { data: auth } = useQuery({
  //     queryKey: ['auth'],
  //     retry: 1,
  //   queryFn: () => {
  //     // Return the existing data from the cache instead of null
  //     const queryClient = useQueryClient();
  //     return queryClient.getQueryData(['auth']);
  //   },
  //   staleTime: Infinity,
  //   gcTime: Infinity,
  //   enabled: true,
  // });

  return {
    user: auth?.user ?? null,
    token: auth?.auth_token ?? null,
    isAuthenticated: !!auth?.auth_token,
  };
}; 