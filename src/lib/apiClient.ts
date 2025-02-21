import axios from "axios";
import { useAuth } from "../hooks/useAuth";

import { useLogout } from "../hooks/mutations/auth.mutation";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const { user,isAuthenticated,token } = useAuth();

const actotaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers,
});

actotaApi.interceptors.request.use(
  (config) => {
   
    if (true) {
      config.headers.Authorization = `Bearer ${token || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWxpa0BnbWFpbC5jb20iLCJleHAiOjE3NDAxNjI3NjIsImlhdCI6MTc0MDA3NjM2MiwidXNlcl9pZCI6IjY3Yjc3NTRhMjY2ZjY0Y2MyOWZlZGVlYiJ9.FQZBB1m6w5VsqEbU2EamDh3tq3nHyX1mvZNhy0DDcHE'}`;
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
      useLogout();
    }
    return Promise.reject(error);
  }
);

export default actotaApi;
