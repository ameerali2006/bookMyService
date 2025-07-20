import { createClient } from "redis";
import {ENV} from './env/env'

const redisClient=createClient({
    name:'defalt',
    password:ENV.REDIS_PASSWORD as string,
    socket:{
        host:ENV.REDIS_HOST,
        port:Number(ENV.REDIS_PORT),

    }
})
redisClient.on('error',(err)=>{
    console.error('redis clint error:',err)
})
const connectRedis=async ():Promise<void>=>{
    try {
        await redisClient.connect()
        console.log('redis is connected succesfully')
    } catch (error) {
        console.error('redis clint error:',error)
    }
}
export {connectRedis,redisClient}