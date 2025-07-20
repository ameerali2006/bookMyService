import userAxios from "@/config/axiosSevice/UserAxios";
import adminAxios from "@/config/axiosSevice/AdminAxios"; 


interface RegisterPayload{
    name:string
    email:string
    phone:string
    password:string
    confirmPassword:string
}

export const authService={
    generateOtp:async (email:string)=>{
        console.log('otp-g',email)
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
    adminLogin: async (credentials: { email: string; password: string }) => {
        return await adminAxios.post("/login", credentials);
    },
    logout: async ()=>{
        return await userAxios.post('/logout')
    }
}