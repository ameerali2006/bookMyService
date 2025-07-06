import  express from "express";
import cors from 'cors'
import { UserRoute } from "./routes/user.route";
import {AdminRoute} from "./routes/admin.route"
const app=express()

app.use(
    cors({
        origin:process.env.FRONTEND_URI||'http://localhost:5173',
        credentials:true
    })
)
app.use(express.json())







app.use('/',new UserRoute().router)
app.use('/admin',new AdminRoute().router)

 
export default app