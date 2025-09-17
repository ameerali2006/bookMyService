import workerAxios from "@/config/axiosSevice/WorkerAxios"

export const  workerService={
    getWorkingDetails:async (email:string)=>{
       
        return await workerAxios.get(`/profile/slot?email=${email}`)
    }
}