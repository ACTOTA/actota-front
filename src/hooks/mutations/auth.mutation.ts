import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import { LoginPayload, SignUpPayload, AuthResponse } from '@/src/types/mutations/auth';
import axios from 'axios';
import { signOut } from '@/src/helpers/auth';
const useLogin = () => {
  const mutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axios.post<any>(
        "/api/auth/signin",
        payload
      );
      return data;
    },
   
   
  });

  return { ...mutation, isLoading: mutation.isPending };
};

const useSignUp = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
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

  return { ...mutation, isLoading: mutation.isPending };
};

const useLogout = () => {
  
  const mutation = useMutation({
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

  return { ...mutation, isLoading: mutation.isPending };
};

export { useLogin, useSignUp, useLogout };
