import "reflect-metadata"; 
import { createServer } from "http";
import app from "./app";
import { connectRedis } from "./config/redis";
import { connectDB } from "./config/db";
import {ENV} from './config/env/env'

const port:number|string=ENV.PORT

const startServer=async ():Promise<void>=>{
    try {
        await connectDB()
        await connectRedis()
        const server=createServer(app)

        server.listen(port,()=>{
            console.log('server is running')
        })
    } catch (error) {
        console.error('server Error',error)
         
    }  
 
}   
startServer()        