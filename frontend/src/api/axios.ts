import axios from "axios";
import { getToken } from "../utils/storage";

const api = axios.create({
  baseURL: "http://192.168.1.5:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle global errors (e.g. 401 token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default api;
