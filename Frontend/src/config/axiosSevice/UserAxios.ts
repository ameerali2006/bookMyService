import axios, {AxiosError} from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import { addUserToken, removeUserToken } from "@/redux/slice/userTokenSlice";
import store from "../../redux/store";
import { PUBLIC_ROUTES } from "../constant/apiRoutes";

const   userAxios=axios.create({
  baseURL:import.meta.env.VITE_SERVER_BASEURL||'http://localhost:5000',
  withCredentials:true

})

const isPublicRoute = (url: string | undefined): boolean => {
  if (!url) return false;
  return PUBLIC_ROUTES.some(route => url.includes(route));
};

userAxios.interceptors.request.use(

  (config:InternalAxiosRequestConfig)=>{
    console.log('axios1')
    const token = store.getState().userTokenSlice.userToken;
    console.log('axios1')
    console.log(config.url)

    if (!isPublicRoute(config.url) && token) {
      console.log('axios2')
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {

      console.warn(" No token found in Redux store!");
    }
    console.log('axios3')

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
)
userAxios.interceptors.response.use(
  (response:AxiosResponse)=>response,
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
          `${import.meta.env.VITE_SERVER_BASEURL}/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        // console.log(" New Access Token:", newAccessToken);

        store.dispatch(addUserToken(newAccessToken));
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return userAxios(originalRequest);
      } catch (refreshError) {
        console.error(" Refresh Token Failed:", refreshError);
        store.dispatch(removeUserToken());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  } 
)
export default userAxios