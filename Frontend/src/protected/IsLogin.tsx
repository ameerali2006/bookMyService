import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Props {
  children: React.ReactNode;
}
function IsLogin({ children }: Props) {
  const userToken = useSelector(
    (state: RootState) => state.userTokenSlice.user
  );

  if (!userToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default IsLogin;