import  express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { UserRoute } from "./routes/user.route";
import {AdminRoute} from "./routes/admin.route"
import {ENV} from './config/env/env'
const app=express()

app.use(
    cors({
        origin:ENV.FRONTEND_URI,
        credentials:true
    })
)
app.use(express.json())







app.use('/',new UserRoute().router)
app.use('/admin',new AdminRoute().router)

 
export default app