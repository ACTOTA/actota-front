import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import { LoginPayload, SignUpPayload, AuthResponse } from '@/src/types/mutations/auth';
import axios from 'axios';

const useLogin = () => {
  
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axios.post<any>(
        "/api/auth/signin",
        payload
      );
      console.log('data from login', data);
      return {auth_token: data.data.auth_token, user: payload};
    },
    onSuccess: (data:any) => {
      // Store auth data in React Query cache
      // queryClient.setQueryData(['auth'], {
      //   auth_token: data.auth_token,
      //   user: data.user,
      //   isAuthenticated: true
      // });
      // router.push('/');
      // router.back()
    },
   
  });
};

const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const { data } = await axios.post<any>(
        "/api/auth/signup",
        payload
      );
      return {auth_token: data.data.auth_token, user: payload};
    },
    onSuccess: (data:any) => {
      // Store auth data in React Query cache
      // queryClient.setQueryData(['auth'], {
      //   auth_token: data.auth_token,
      //   user: data.user,
      //   isAuthenticated: true
      // });
      
      // router.push('/');
    },
    onError(error) {
      console.error('useSignUp', getErrorMessage(error));
      // Clear auth data on error
      // queryClient.setQueryData(['auth'], null);
    },
  });
};

const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // const { data } = await axios.post("/api/auth/signout");
      return {success: true};
    },
    onSuccess: () => {
      // Clear auth data from cache
      // queryClient.setQueryData(['auth'], null);
      localStorage.removeItem('auth');
      // Remove token from axios headers
    },
  });
};

export { useLogin, useSignUp, useLogout };
