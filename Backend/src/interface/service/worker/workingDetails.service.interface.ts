import { IDaySchedule, IWorkingDetailsDocument } from "../../model/working-details.interface";

export interface IWorkingDetailsManagement{
    updateWorkingDetails(email:string,payload:IDaySchedule):Promise<{success:boolean,message:string,data:IWorkingDetailsDocument|null}>
    getWorkingDetails(email: string): Promise<IWorkingDetailsDocument>
}