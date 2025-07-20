import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/shared/Loader";
import Login from "./pages/user/Login";
import Homepage from "./pages/user/Home";

const Register=lazy(()=>import("./pages/user/Register"))

const User = () => {
  return (
    <Suspense fallback={<Loader message="loading..."/>}>
        <Routes>
            <Route path="/register" element={<Register />}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Homepage/>}/>
            

        </Routes>
      
    </Suspense> 
  ) 
}

export default User
