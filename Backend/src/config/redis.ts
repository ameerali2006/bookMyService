import { createClient } from "redis";
import dotenv from 'dotenv'

dotenv.config()

const redisClint=createClient({
    name:'defalt',
    password:process.env.REDIS_PASSWORD as string,
    socket:{
        host:process.env.REDIS_HOST,
        port:Number(process.env.REDIS_PORT),

    }
})
redisClint.on('error',(err)=>{
    console.error('redis clint error:',err)
})
const connectRedis=async ():Promise<void>=>{
    try {
        await redisClint.connect()
        console.log('redis is connected succesfully')
    } catch (error) {
        console.error('redis clint error:',error)
    }
}
export {connectRedis,redisClint}