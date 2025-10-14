import userAxios from "@/config/axiosSevice/UserAxios";
    
    interface  AddressForm {
        label: "Home" | "Work" | "Shop"
        buildingName: string
        street: string
        area: string
        city: string
        state: string
        country: string
        pinCode: string
        landmark: string
        latitude?: number
        longitude?: number
    }
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
    getWorkerAvailability:async (workerId:string)=>{
        
        return await userAxios.get(`/workers/availability?workerId=${workerId}`)

    },
    getUserAddress:async ()=>{
        return await userAxios.get('/addresses')
    },
    addUserAddress:async (data:AddressForm)=>{
       
        return await userAxios.post('/addAddress',data)
    },
    setPrimaryAddress:async (toSetId:string)=>{
        
        return await userAxios.put('/address/setPrimary',{toSetId})
    },
    selectDateTimeAvailablity:async (data:{time:string,date:Date,description:string,workerId:string})=>{
       
        return await userAxios.post('/basicBookingDetails',data)
    },
    
} 