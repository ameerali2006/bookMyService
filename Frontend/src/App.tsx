import { BrowserRouter as Roter, Routes, Route } from "react-router-dom";
import User from "./User";
import Admin from "./Admin";
import Worker from "./Worker";
import {ToastContainer} from 'react-toastify'
import WorkerLayout from "./layout/WorkerLayout";




function App() {
  

  return (
    <>
    <ToastContainer/>
    <Roter>
      <Routes>
        <Route path="/*" element={<User/>}/>
        <Route path="/worker/*" element={<WorkerLayout><Worker /></WorkerLayout>}/>
        <Route path="/admin/*" element={<Admin/>}/>
      </Routes>
    </Roter>
    
    </>
  )
}

export default App
