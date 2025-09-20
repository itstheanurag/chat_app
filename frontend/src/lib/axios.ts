/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { flushLocalTokens, getToken, saveToken } from "./token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: any;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((req) => {
    if (error) {
      req.reject(error);
    } else {
      req.config.headers.Authorization = `Bearer ${token}`;
      req.resolve(api(req.config));
    }
  });
  failedQueue = [];
};

// Request interceptor – attach access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle expired token (401/403)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Retry only once per request
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getToken("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = data.accessToken;
        saveToken("accessToken", newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear tokens and redirect to login
        flushLocalTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
