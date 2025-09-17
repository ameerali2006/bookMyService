import { IWorkingDetailsDocument } from "../../model/working-details.interface";

export interface IGetWorkingDetails{
   execute(email: string): Promise<IWorkingDetailsDocument>

}