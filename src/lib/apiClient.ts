import axios from "axios";
import { getAuthCookie, signOut } from "@/src/helpers/auth";
import { useLogout } from "../hooks/mutations/auth.mutation";
import { clientEnv } from "./config/client-env";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Get API URL from runtime config on client-side or env on server-side
const getApiUrl = () => {
  // Server-side rendering - use process.env
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Client-side rendering - use runtime config
  return clientEnv.NEXT_PUBLIC_API_URL;
};

const actotaApi = axios.create({
  baseURL: getApiUrl(),
  headers,
});

actotaApi.interceptors.request.use(
  async (config) => {
    const token = await getAuthCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

actotaApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (expired token)
      if (typeof window !== 'undefined') {
        // Clear user data from localStorage
        const { removeLocalStorageItem } = require('@/src/utils/browserStorage');
        removeLocalStorageItem('user');
        removeLocalStorageItem('token');
        
        // Clear cookies
        signOut();
        
        // Redirect to sign in page if not already there
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth/signin')) {
          window.location.href = '/auth/signin?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default actotaApi;
