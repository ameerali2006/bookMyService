import { BrowserRouter as Roter, Routes, Route } from "react-router-dom";
import User from "./User";
import Admin from "./Admin";
import Worker from "./Worker";
import {ToastContainer} from 'react-toastify'
import { DemoPaymentWrapper } from "./components/stripe/Stripe";




function App() {
  

  return (
    <>
    <ToastContainer/>
    <Roter>
      <Routes>
        <Route path="/*" element={<User/>}/>
        <Route path="/worker/*" element={<Worker/>}/>
        <Route path="/admin/*" element={<Admin/>}/>
      </Routes>
    </Roter>
    
    </>
  )
}

export default App
