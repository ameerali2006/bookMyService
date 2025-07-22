import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/shared/Loader";
import WorkerLogin from "./pages/worker/Login";
import WorkerDashboard from "./pages/worker/Dashboard";
import IsWorkerLogout from "./protected/WorkerIsLogout";
import IsWorkerLogin from "./protected/WorkerIsLogin";


const WorkerRegistration=lazy(()=>import("@/pages/worker/Register"))
 
const Worker = () => {
  return (
    <Suspense fallback={<Loader message="loading..."/>}>
        <Routes>
            
            <Route path="/register" element={<IsWorkerLogout><WorkerRegistration/></IsWorkerLogout>}/>
            <Route path="/login" element={<IsWorkerLogout><WorkerLogin/></IsWorkerLogout>}/>
            <Route path="/dashboard" element={<IsWorkerLogin><WorkerDashboard/></IsWorkerLogin>}/>
            
            

        </Routes>
      
    </Suspense> 
  )
}

export default Worker
