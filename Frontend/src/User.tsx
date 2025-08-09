import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/shared/Loader";
import IsLogin from "./protected/IsLogin";
import IsLogout from "./protected/IsLogout";
import UserForgotPassword from "./pages/user/ForgotPassword";
import UserResetPassword from "./pages/user/UserResetPassword";




const Register = lazy(()=>import("./pages/user/Register"))
const Homepage = lazy(()=>import("./pages/user/Home"))
const  Login   = lazy(()=>import("./pages/user/Login")) ;


const User = () => {
  return (
    <Suspense fallback={<Loader message="loading..."/>}>
        <Routes>
            <Route index element={<Homepage/>}/>
            <Route path="/register" element={<IsLogout><Register /></IsLogout>}/>
            <Route path="/login" element={<IsLogout><Login/></IsLogout>}/>
            <Route path="/forgot-Password" element={<IsLogout><UserForgotPassword/></IsLogout>}/>
            <Route path="/reset-Password/:token" element={<IsLogout><UserResetPassword/></IsLogout>}/>

        </Routes>
      
    </Suspense> 
  ) 
}

export default User
