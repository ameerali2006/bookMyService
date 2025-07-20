import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/shared/Loader";


const LoginPage = lazy(()=>import("./pages/admin/LoginPage"));

const Admin = () => {
  return (
    <>
    <Suspense fallback={<Loader message={'loading...'} />}>
        <Routes>
          <Route path="/login"  element={<LoginPage />}></Route>
          
          
        </Routes>
      </Suspense></>
  )
}

export default Admin
