import axios from "axios";
import { useAuth } from "../hooks/useAuth";

import { useLogout } from "../hooks/mutations/auth.mutation";

const { user,isAuthenticated,token } = useAuth();

const actotaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    // Add these additional headers for ngrok
    'Bypass-Tunnel-Reminder': 'true',
    'User-Agent': 'Mozilla/5.0',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
});

// Add request interceptor to add auth token if it exists
actotaApi.interceptors.request.use((config) => {
  // Ensure headers exist
  config.headers = config.headers || {};
  
  // Add auth token if it exists
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Always include these headers for ngrok
  config.headers['ngrok-skip-browser-warning'] = 'true';
  config.headers['Bypass-Tunnel-Reminder'] = 'true';
  
  return config;
});

// Add response interceptor to handle errors
actotaApi.interceptors.response.use(
  (response) => {
    // Check if the response is HTML (ngrok warning page)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      throw new Error('Received HTML response instead of JSON');
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default actotaApi;
