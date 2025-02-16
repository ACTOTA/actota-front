import axios from "axios";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Accept-Encoding": "gzip,deflate,compress",
};

export const actotaApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
});
