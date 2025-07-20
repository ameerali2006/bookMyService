import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/shared/Loader";


const WorkerRegistration=lazy(()=>import("@/pages/worker/Register"))
 
const Worker = () => {
  return (
    <Suspense fallback={<Loader message="loading..."/>}>
        <Routes>
            
            <Route path="/register" element={<WorkerRegistration/>}/>
            
            
            

        </Routes>
      
    </Suspense> 
  )
}

export default Worker
