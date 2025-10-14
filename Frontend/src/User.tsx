import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/shared/Loader";
import IsLogin from "./protected/IsLogin";
import IsLogout from "./protected/IsLogout";
import UserForgotPassword from "./pages/user/ForgotPassword";
import UserResetPassword from "./pages/user/UserResetPassword";
import { ProfilePage } from "./pages/user/Profile";
import WorkerListingPage from "./pages/user/WorkerListing";
import BasicBookingDetails from "./pages/user/BasicBookingDetails";
import { USER_ROUTES } from "./config/constant/routes/userRoutes";
import AdvancePaymentPage from "./pages/user/AdvancePaymentPage";




const Register = lazy(()=>import("./pages/user/Register"))
const Homepage = lazy(()=>import("./pages/user/Home"))
const  Login   = lazy(()=>import("./pages/user/Login")) ;


const User = () => {
  return (
    <Suspense fallback={<Loader message="loading..."/>}>
        <Routes>
       
        <Route index element={<Homepage />} />

        
        <Route
          path={USER_ROUTES.REGISTER}
          element={<IsLogout><Register /></IsLogout>}
        />
        <Route
          path={USER_ROUTES.LOGIN}
          element={<IsLogout><Login /></IsLogout>}
        />
        <Route
          path={USER_ROUTES.FORGOT_PASSWORD}
          element={<IsLogout><UserForgotPassword /></IsLogout>}
        />
        <Route
          path={USER_ROUTES.RESET_PASSWORD}
          element={<IsLogout><UserResetPassword /></IsLogout>}
        />

       
        <Route
          path={USER_ROUTES.PROFILE}
          element={<IsLogin><ProfilePage /></IsLogin>}
        />
        <Route
          path={USER_ROUTES.SERVICES.LIST}
          element={<IsLogin><WorkerListingPage /></IsLogin>}
        />
        <Route
          path={USER_ROUTES.SERVICES.BOOK_DETAILS}
          element={<IsLogin><BasicBookingDetails /></IsLogin>}
        />
        <Route
          path={USER_ROUTES.SERVICES.PRE_BOOKING_SLOT}
          element={<IsLogin><AdvancePaymentPage /></IsLogin>}
        />
      </Routes>
      
    </Suspense> 
  ) 
}

export default User
