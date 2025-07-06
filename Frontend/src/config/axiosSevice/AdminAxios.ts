import axios, {AxiosError} from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig} from 'axios'

import { addAdminToken, removeAdminToken } from "@/redux/slice/adminTokenSlice";
import store from "../../redux/store";

// Define an Axios instance
const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASEURL+"/admin",
  withCredentials: true,
});

// Request Interceptor
adminAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().adminTokenSlice.adminToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn(" No token found in Redux store!");
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
adminAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      console.error(" No response from server!");
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response.status;

    //  Handle Token Expiry
    if (
      status === 403 &&
      (error.response.data as { message: string })?.message ===
        "Invalid or expired token." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        console.log(" Refreshing Token...");
        const refreshResponse = await axios.post<{ accessToken: string }>(
          import.meta.env.VITE_SERVER_BASEURL+"/admin/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        // console.log(" New Access Token:", newAccessToken);

        store.dispatch(addAdminToken(newAccessToken));
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return adminAxios(originalRequest);
      } catch (refreshError) {
        console.error(" Refresh Token Failed:", refreshError);
        store.dispatch(removeAdminToken());
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxios;
