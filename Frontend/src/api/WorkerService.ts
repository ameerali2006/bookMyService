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
    }
}