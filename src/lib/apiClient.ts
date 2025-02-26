import axios from "axios";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const actotaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
});

// actotaApi.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage instead of using hook
//     const auth = JSON.parse(localStorage.getItem('auth') || '{}');
//     const token = auth?.auth_token;
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

actotaApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
      localStorage.removeItem('auth');
      // Optionally redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default actotaApi;
