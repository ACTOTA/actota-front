"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/src/utils/getErrorMessage';
import { LoginPayload, SignUpPayload, AuthResponse } from '@/src/types/mutations/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signOut } from '@/src/helpers/auth';
const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axios.post<any>(
        "/api/auth/signin",
        payload
      );
      return data;
    },
    onSuccess: (data:any) => {
      router.back()
      localStorage.setItem('user', JSON.stringify(
        {user_id: data.data._id.$oid, first_name: data.data.first_name, last_name: data.data.last_name, email: data.data.email,}
      ));

     window.location.href = '/';
    },
   
  });
};

const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const { data } = await axios.post<any>(
        "/api/auth/signup",
        payload
      );
      return data;
    },
    onSuccess: (data:any) => {
      router.back()
      localStorage.setItem('user', JSON.stringify(
        {user_id: data.data._id.$oid, first_name: data.data.first_name, last_name: data.data.last_name, email: data.data.email,}
      ));

     window.location.href = '/';
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
      localStorage.removeItem('user');
    },
  });
};

export { useLogin, useSignUp, useLogout };
