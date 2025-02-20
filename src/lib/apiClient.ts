import axios from "axios";
import { useAuthStore } from '@/src/store/authStore';

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Accept-Encoding": "gzip,deflate,compress",
};

 const actotaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
});


actotaApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
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
      const { clear: clearAuth } = useAuthStore.getState();
      clearAuth();
    }
    return Promise.reject(error);
  }
);

export default actotaApi;
