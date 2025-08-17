import { createAxiosClient } from "./AxiosService";
import { removeWorker } from "@/redux/slice/workerTokenSlice";
import { PUBLIC_ROUTES } from "../constant/apiRoutes";

const workerAxios = createAxiosClient({
  baseURL: "/worker",
  publicRoutes: PUBLIC_ROUTES,
  removeAuthAction: removeWorker,
  loginRedirect: "/worker/login",
  refreshTokenEndpoint: "/worker/refresh-token"
});

export default workerAxios;
