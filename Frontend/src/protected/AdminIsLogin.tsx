import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Props {
  children: React.ReactNode;
}
function IsAdminLogin({ children }: Props) {
  const adminToken = useSelector(
    (state: RootState) => state.adminTokenSlice.admin
  );

  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}

export default IsAdminLogin;
