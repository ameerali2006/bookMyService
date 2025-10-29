import { WorkerProfileDTO } from "../../../dto/worker/workingDetails.dto";
import { IDaySchedule, IWorkingDetailsDocument } from "../../model/working-details.interface";
export interface updateWorker{
  name: string
  phone: string

  experience:"0-1" | "2-5" | "6-10" | "10+"
  fees: number
  image:string
}
export interface IWorkingDetailsManagement{
    updateWorkingDetails(email:string,payload:IDaySchedule):Promise<{success:boolean,message:string,data:IWorkingDetailsDocument|null}>
    getWorkingDetails(email: string): Promise<IWorkingDetailsDocument>
    getProfileDetails(workerId: string): Promise<{success:boolean,message:string,worker:WorkerProfileDTO|null}>
    updateWorkerProfile(workerId: string,updateData:Partial<updateWorker>): Promise<{success:boolean,message:string,worker:WorkerProfileDTO|null}>
}