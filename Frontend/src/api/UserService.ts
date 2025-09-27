import userAxios from "@/config/axiosSevice/UserAxios";
export const userService={
    getUserDetails:async ()=>{
        
        return await userAxios.get('/profile/userDetails')

    },
}