import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const connectDB=async ():Promise<void>=>{
    try {
        const mongoURl:string|undefined=process.env.MONGO_URI
        if(!mongoURl){
            throw new Error("MONGO_URI is not defined in environment variables")
        }
        await mongoose.connect(mongoURl)
        console.log('Mongo db is connected Successfuly')
    } catch (error) {
        console.error('mongo db Error',error)
        
    }
}
export {connectDB}