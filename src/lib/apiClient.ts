import axios from "axios";
import { getAuthCookie, signOut } from "@/src/helpers/auth";
import { useLogout } from "../hooks/mutations/auth.mutation";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const actotaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
      signOut();
      // useLogout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default actotaApi;
