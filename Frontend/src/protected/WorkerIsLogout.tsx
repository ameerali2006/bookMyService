import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Props {
  children: React.ReactNode;
}

function IsWorkerLogout({ children }: Props) {
  const workerToken = useSelector(
    (state: RootState) => state.workerTokenSlice.worker
  );

  if (workerToken) {
    return <Navigate to="/worker/dashboard" />; // Redirect to worker home/dashboard
  }

  return <>{children}</>;
}

export default IsWorkerLogout;
