import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/shared/Loader";
import AdminDashboard from "./pages/admin/AdminDashBoard";
import IsAdminLogin from "./protected/AdminIsLogin";
import IsAdminLogout from "./protected/AdminIsLogout";
import UserManagement from "./pages/admin/UserManagement";


const LoginPage = lazy(()=>import("./pages/admin/LoginPage"));

const Admin = () => {
  return (
    <>
    <Suspense fallback={<Loader message={'loading...'} />}>
        <Routes>
          <Route path="/login"  element={<IsAdminLogout><LoginPage /></IsAdminLogout>}></Route>
          <Route path="/dashboard"  element={<IsAdminLogin><AdminDashboard /></IsAdminLogin>}></Route>
          <Route path="/users" element={<UserManagement/>} /></Routes>
      </Suspense></>
  )
}

export default Admin
