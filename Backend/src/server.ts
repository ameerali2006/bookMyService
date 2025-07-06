import "reflect-metadata"; 
import { createServer } from "http";
import app from "./app";
import { connectRedis } from "./config/redis";
import { connectDB } from "./config/db";

const port:number|string=process.env.POST||5000
console.log('hello')
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