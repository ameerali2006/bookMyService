import userAxios from "@/config/axiosSevice/UserAxios";
export const userService={
    getUserDetails:async ()=>{
        
        return await userAxios.get('/profile/userDetails')

    },
    updateUserDetails:async (user:Partial<{name:string,phone?:string,email?:string,image?:string,}>)=>{
        
        return await userAxios.put('/profile/updateUserDetails',user)

    },
    getWorkersNearBy:async (search:string="",sort:string="asc",page:number=1,pageSize:number=10,serviceId:string,lat:number,lng:number)=>{
        
        return await userAxios.get("/workers/nearby", {
        params: {
            search,
            sort,
            page,
            pageSize,
            serviceId, 
            lat,
            lng
        },
        });

    },
} 