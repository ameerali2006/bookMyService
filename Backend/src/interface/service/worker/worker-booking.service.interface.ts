import {
  ApprovedServices,
  IWorkerRequestResponse,
} from "../../../dto/worker/workingDetails.dto";
import { IBookingPopulated } from "../../model/booking.model.interface";

export interface serviceData {
  bookingId: string;
  serviceName: string;
  durationHours: number;
  distance: number;
  additionalItems?: {
    name: string;
    price: number;
  }[];
  additionalNotes?: string;
}
export interface IRequestFilters {
  workerId: string;
  search?: string;
  status?: "pending" | "accepted" | "rejected";
  date?: string;
  page: number;
  limit: number;
}
export interface IWorkerBookingService {
  approveService(
    data: serviceData
  ): Promise<{ success: boolean; message: string }>;
  rejectService(
    bookingId: string,
    description: string
  ): Promise<{ success: boolean; message: string }>;
  getServiceRequests(
    filter: IRequestFilters
  ): Promise<{
    success: boolean;
    message: string;
    data?: IWorkerRequestResponse;
  }>;
  getWorkerApprovedBookings(query: {
    workerId: string;
    page: number;
    limit: number;
    search?: string;
    status?: "approved" | "in-progress" | "awaiting-final-payment";
  }): Promise<{
    success: boolean;
    message: string;
    today?: ApprovedServices[];
    upcoming?: ApprovedServices[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  getWorkerAprrovalpageDetails(bookingid:string):Promise<{success:boolean,message:string,booking?:(IBookingPopulated&{verification:boolean})}>
  reachedCustomerLocation(bookingid:string):Promise<{success:boolean,message:string,booking?:(IBookingPopulated&{verification:boolean})}>
  verifyWorker(bookingId:string,otp:string):Promise<{success:boolean,message:string}>

}
