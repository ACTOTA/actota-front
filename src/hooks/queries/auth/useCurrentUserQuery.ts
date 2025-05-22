import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface UserSession {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  customer_id?: string;
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await axios.get('/api/auth/session');
      
      if (response.data.success && response.data.data) {
        // Update localStorage with the full user data including role
        const userData = response.data.data;
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const userJson = JSON.parse(currentUser);
          localStorage.setItem('user', JSON.stringify({
            ...userJson,
            role: userData.role
          }));
        }
        
        return userData as UserSession;
      }
      
      throw new Error('Failed to get user session');
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}