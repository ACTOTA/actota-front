import Axios, { AxiosError, AxiosInstance } from "axios";

const serverApi = (): AxiosInstance => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,deflate,compress",
  };

  const serverApiInstance = Axios.create({
    baseURL: "/api",
    headers,
  });

  serverApiInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      if (error?.response?.status === 401) {
        if (!window.location.pathname.includes("/signin")) {
          window.location.href = "/signout";
        } else {
          await Promise.reject(error);
        }
      } else {
        await Promise.reject(error);
      }
    },
  );

  return serverApiInstance;
};

export default serverApi();
