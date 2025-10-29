import type { ChangePasswordInput } from "@/components/shared/ChangePassword";
import workerAxios from "@/config/axiosSevice/WorkerAxios"
type Break = {
  label: string;
  breakStart: string;
  breakEnd: string;
};

type DaySchedule = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breaks: Break[];
};

export type PayLoad = {
  days: DaySchedule[];
};
export const  workerService={
    getWorkingDetails:async (email:string)=>{
       
        return await workerAxios.get(`/profile/slot?email=${email}`)
    },
    updateWorkingDetails:async (email:string,payload:PayLoad)=>{
       
        return await workerAxios.post(`/profile/slot/update`,{email,payload})
    },
    getProfileDetails:async ()=>{
      return await workerAxios.get(`/profile/details`)
    },
    updateProfileDetails: async (payload: {
    name?: string
    phone?: string
    experience?: string
    fees?: number
    image?: string
  }) => {
    console.log(payload)
    return await workerAxios.put(`/profile/update`, payload)
  },
  changePassword:async (payload:ChangePasswordInput ) => {
   
    return await workerAxios.put(`/profile/changePassword`, payload)
  },
}