import axios from "axios";
import { WarningToast,ErrorToast } from '@/components/shared/Toaster';
import {  removeAdmin } from "@/redux/slice/adminTokenSlice";
import store from "../../redux/store";

// Define an Axios instance
const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASEURL+"/admin",
  withCredentials: true,
});

let isRefreshing = false;

adminAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
		console.log(error)
		const originalRequest = error.config;
        
        if (originalRequest.url === "/login") {
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
					await adminAxios.post("/refresh-token");
					isRefreshing = false;
					return adminAxios(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;
					store.dispatch(removeAdmin());
					await adminAxios.post("/logout")
					window.location.href = "/admin/login";
					WarningToast("Please login again");
					return Promise.reject(refreshError);
				}
			}
		}
		if (
			(error.response.status === 401 &&
				error.response.data.message === "Invalid token") ||
			(error.response.status === 403 &&
				error.response.data.message === "Token is blacklisted") ||
			(error.response.status === 403 &&
				error.response.data.message ===
					"Access denied: Your account has been blocked" &&
				!originalRequest._retry)
		) {
			console.log("Session ended");
			store.dispatch(removeAdmin ());

			window.location.href = "/admin/login";
			WarningToast("Please login again");
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);

export default adminAxios;
