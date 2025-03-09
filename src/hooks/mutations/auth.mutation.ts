import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import { LoginPayload, SignUpPayload, AuthResponse } from '@/src/types/mutations/auth';
import axios from 'axios';
import { signOut } from '@/src/helpers/auth';
const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axios.post<any>(
        "/api/auth/signin",
        payload
      );
      return data;
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
      return data;
    },
  
    onError(error) {
      console.error('useSignUp', getErrorMessage(error));
      // Clear auth data on error
      // queryClient.setQueryData(['auth'], null);
    },
  });
};

const useLogout = () => {
  
  return useMutation({
    mutationFn: async () => {
      // const { data } = await axios.post("/api/auth/signout");
      return {success: true};
    },
    onSuccess: () => {
      signOut();
      // Use safe localStorage wrapper
      const { removeLocalStorageItem } = require('@/src/utils/browserStorage');
      removeLocalStorageItem('user');
    },
  });
};

export { useLogin, useSignUp, useLogout };
