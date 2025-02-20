import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import { LoginPayload, SignUpPayload } from '@/src/types/mutations/auth';
import axios from 'axios';

const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      console.warn(payload, 'payload');

      const response = await axios.post(
        "/api/auth/signin",
        payload
      );
    
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['login'],
      });
    },
    onError(error) {

      console.error('useLogin', getErrorMessage(error));
    },
  });
};

const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      console.warn(payload, 'payload');

      const response = await axios.post(
        "/api/auth/signup",
        payload
      );
    
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['signUp'],
      });
    },
    onError(error) {
      console.error('useSignUp', getErrorMessage(error));
    },
  });
};


export { useLogin, useSignUp };
