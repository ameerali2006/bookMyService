import type { ChangePasswordInput } from "@/components/shared/ChangePassword";
import workerAxios from "@/config/axiosSevice/WorkerAxios"
type Break = {
  label: string;
  breakStart: string;
  breakEnd: string;
};
interface AdditionalItem {
  name: string;
  price: number;
}

interface ApprovalData {
  bookingId: string;
  serviceName: string;
  endTime: string;
  additionalItems?: AdditionalItem[];
  additionalNotes?: string;
}

type DaySchedule = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breaks: Break[];
};
interface ICustomSlot {
  date: Date
  startTime: string
  endTime: string
}
interface IHoliday {
  date: Date
  reason?: string
}
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
  getCalenderData:async ()=>{
    return await workerAxios.get(`/calender/getData`)
  },
  updateCalenderData:async (data:{holidays:IHoliday[],customSlots:ICustomSlot[]})=>{
    return await workerAxios.put('/calender/update',data)
  },
  serviceApprove:async (data:ApprovalData)=>{
    return await workerAxios.put('/service/approve',data)
  },
  serviceReject:async (data:{description:string,bookingId:string})=>{
    return await workerAxios.put('/service/reject',data)
  },
  

}