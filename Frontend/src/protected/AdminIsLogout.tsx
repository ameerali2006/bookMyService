import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Props {
  children: React.ReactNode;
}

function IsAdminLogout({ children }: Props) {
  const adminTocken = useSelector(
    (state: RootState) => state.adminTokenSlice.admin
  );

  if (adminTocken) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default IsAdminLogout;
