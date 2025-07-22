import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Props {
  children: React.ReactNode;
}

function IsWorkerLogin({ children }: Props) {
  const workerToken = useSelector(
    (state: RootState) => state.workerTokenSlice.worker
  );

  if (!workerToken) {
    return <Navigate to="/worker/login" />; // Or your actual worker login route
  }

  return <>{children}</>;
}

export default IsWorkerLogin;
