import { createAxiosClient } from "./AxiosService";
import { removeAdmin } from "@/redux/slice/adminTokenSlice";

const adminAxios = createAxiosClient({
  baseURL:"/admin",
  removeAuthAction: removeAdmin,
  loginRedirect: "/admin/login",
  refreshTokenEndpoint: "/admin/refresh-token"
});

export default adminAxios;
