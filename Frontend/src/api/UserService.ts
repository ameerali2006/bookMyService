import userAxios from "@/config/axiosSevice/UserAxios";
export const userService={
    getUserDetails:async ()=>{
        
        return await userAxios.get('/profile/userDetails')

    },
    updateUserDetails:async (user:Partial<{name:string,phone?:string,email?:string,image?:string,}>)=>{
        
        return await userAxios.put('/profile/updateUserDetails',user)

    },
}