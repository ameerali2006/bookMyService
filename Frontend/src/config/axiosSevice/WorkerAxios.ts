import axios from "axios";
import store from "../../redux/store";
import { removeWorker } from "@/redux/slice/workerTokenSlice"; 
import { PUBLIC_ROUTES } from "../constant/apiRoutes";
import { ENV } from "../env/env";
import { WarningToast, ErrorToast } from "@/components/shared/Toaster";

const workerAxios = axios.create({
  baseURL: ENV.VITE_SERVER_BASEURL+"/worker",
  withCredentials: true,
});

let isRefreshing = false;

workerAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error);
    const originalRequest = error.config;

    if (PUBLIC_ROUTES.includes(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      error.response.data.message === "Token Expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await workerAxios.post("/worker/refresh-token");
          isRefreshing = false;
          return workerAxios(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          store.dispatch(removeWorker());
          window.location.href = "/worker/login";
          WarningToast("Please login again");
          return Promise.reject(refreshError);
        }
      }
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.includes("Access denied") &&
      error.response?.data?.message?.includes("blocked")
    ) {
      store.dispatch(removeWorker());
      window.location.href = "/worker/login";
      ErrorToast("Your account has been blocked. Please contact support.");
      return Promise.reject(error);
    }

    if (
      (error.response.status === 401 &&
        error.response.data.message === "Invalid token") ||
      (error.response.status === 403 &&
        error.response.data.message === "Token is blacklisted") ||
      (error.response.status === 403 &&
        error.response.data.message === "Access denied: Your account has been blocked" &&
        !originalRequest._retry)
    ) {
      store.dispatch(removeWorker());
      window.location.href = "/worker/login";
      WarningToast("Please login again");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default workerAxios;
