import userAxios from "@/config/axiosSevice/UserAxios";
import adminAxios from "@/config/axiosSevice/AdminAxios"; 
import workerAxios from "@/config/axiosSevice/WorkerAxios"; 
import type { WorkerRegistrationData } from "@/protected/validation/worker/registerZod";


interface RegisterPayload{
    name:string
    email:string
    phone:string
    password:string
    confirmPassword:string
}

export const authService={
    generateOtp:async (email:string)=>{
        
        return await userAxios.post('/generate-otp',{email})

    },
    register:async (formData:RegisterPayload)=>{
        return await userAxios.post('/register',formData)
    },
    googleLogin:async (token:string)=>{
        return await userAxios.post('/google-login',{token})
    },
    verifyOtp:async (otp:string,email:string)=>{
        return await userAxios.post('/verify-otp',{otp,email})
    },
    login: async (credentials: { email: string; password: string }) => {
        return await userAxios.post("/login", credentials);
    },
    userResetLink:async (email:string)=>{
        return await userAxios.post('/forgot-password',{email})
    },
    userResetPassword:async (data:{token:string,password: string,confirmPassword:string})=>{
        return await userAxios.post('/reset-password',data)
    },
    getUserServices:async()=>{
        return await userAxios.get("/getService")
    },
    logout: async ()=>{
        return await userAxios.post('/logout')
    },

    
    
    workerVerifyOtp:async (otp:string,email:string)=>{
        return await workerAxios.post('/verify-otp',{otp,email})
    },
    workerGenerateOtp:async (email:string)=>{
        
        return await workerAxios.post('/generate-otp',{email})

    },
    workerCloudinory:async ()=>{
        return await workerAxios.post('/cloudinary-signature')
    },
    workerRegister: async (data: WorkerRegistrationData) => {
        return await workerAxios.post("/register", data); 
    },
    googleWorkerLogin:async (token:string)=>{
        return await workerAxios.post('/google-auth',{token})
    },
    workerLogin:async (data:{email:string,password:string}) => {
        return await workerAxios.post("/login", data); 
    },
    workerLogout: async ()=>{
        return await workerAxios.post('/logout')
    },

    workerResetLink:async (email:string)=>{
        return await workerAxios.post('/forgot-password',{email})
    },
    workerResetPassword:async (data:{token:string,password: string,confirmPassword:string})=>{
        return await workerAxios.post('/reset-password',data)
    },
    workerIsVerified:async(email:string)=>{
        return await workerAxios.get("/isVerified",{params:{email}})
    },


    
    adminLogin: async (credentials: { email: string; password: string }) => {
        return await adminAxios.post("/login", credentials);
    },
    adminLogout: async () => {
        return await adminAxios.post("/logout");
    },

    


    getServiceNames:async ()=>{
        return await workerAxios.get('/getserviceNames')
    },
}