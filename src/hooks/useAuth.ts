// 'use client'
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { AuthResponse } from '@/src/types/mutations/auth';

// export const useAuth = () => {
//   const auth = JSON.parse(localStorage.getItem('auth') || '{}');
//   // const auth = useQuery({
//   //     queryKey: ['auth'],
//   //     retry: 1,
//   //   queryFn: () => {
//   //      const auth= JSON.parse(localStorage.getItem('auth') || '{}')
//   //     return auth
//   //   },

//   //   staleTime: Infinity,
//   //   gcTime: Infinity,
//   //   // enabled: !!auth
//   // });

//   return {
//     user: auth?.user ?? null,
//     token: auth?.auth_token ?? null,
//     isAuthenticated: !!auth?.auth_token,
//   };
// }; 