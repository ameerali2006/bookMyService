import { IWorkerRequestResponse } from "../../../dto/worker/workingDetails.dto";

export interface serviceData{
    bookingId: string;
    serviceName: string;
    endTime: string;
    additionalItems?: {
        name: string;
        price: number;
    }[] ;
    additionalNotes?: string ;
}
export interface IRequestFilters {
  workerId: string;  
  search?: string;
  status?: "pending" | "accepted" | "rejected" ;
  date?: string;
  page: number;
  limit: number;
}
export interface  IWorkerBookingService{
    approveService(data:serviceData):Promise<{success:boolean, message:string,}>
    rejectService(bookingId:string,description:string):Promise<{success:boolean, message:string,}>
    getServiceRequests(filter:IRequestFilters):Promise<{success:boolean,message:string,data?:IWorkerRequestResponse}>
}
