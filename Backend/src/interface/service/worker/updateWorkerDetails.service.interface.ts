import { IDaySchedule, IWorkingDetailsDocument } from "../../model/working-details.interface";

export interface IUpdateWorkingDetails{
    execute(email:string,payload:IDaySchedule):Promise<{success:boolean,message:string,data:IWorkingDetailsDocument|null}>
}