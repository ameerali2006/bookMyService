import { IBooking } from "../../model/booking.model.interface";
export interface VerifiedPaymentResult {
  bookingId: string
  amountPaid: number
  type: "advance" | "final"
  
}
export interface BookingDetails {
  workerName: string;
  serviceName: string;
  date: string;
  time: string;
  description: string;
  advance: number;
}
export interface IBookingService {
  setBasicBookingDetails(
    userId: string,
    workerId: string,
    time: string,
    date: Date,
    description: string
  ): Promise<{ success: boolean; message: string; bookingId: string | null }>;
  getBookingDetails(
    bookingId: string
  ): Promise<{
    success: boolean;
    message: string;
    details: BookingDetails | null;
  }>;
  updateWorkerDetails(data: {
    bookingId: string;
    workerId: string;
    endingTime: string;
    itemsRequired: Array<{ name: string; price: number; description?: string }>;
    additionalNotes?: string;
  }): Promise<{ success: boolean; message: string; booking?: IBooking }>;
  verifyPayment(
    bookingId: string,
    paymentType: "advance" | "final"
  ): Promise<{ success: boolean; message: string; data: VerifiedPaymentResult | null }>;
}
