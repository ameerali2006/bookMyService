import { IBooking } from "../model/booking.model.interface";
import { PaymentStatus } from "../model/payement.model.interface";
import { IBaseRepository } from "./base.repository.interface";

export interface IBookingRepository extends IBaseRepository<IBooking> {
  createBooking(data: Partial<IBooking>): Promise<IBooking>;
  findById(id: string): Promise<IBooking | null>;
  findByUserId(userId: string): Promise<IBooking[]>;
  findByWorkerId(workerId: string): Promise<IBooking[]>;
  updateStatus(id: string, status: string): Promise<IBooking | null>;
  updateWorkerResponse(id: string, response: string): Promise<IBooking | null>;
  updatePaymentStatus(
    id: string,
    paymentStatus: string,
    paymentId?: string
  ): Promise<IBooking | null>;
  addRating(
    id: string,
    score: number,
    review?: string
  ): Promise<IBooking | null>;
  cancelBooking(id: string): Promise<IBooking | null>;
  findByWorkerAndDate(workerId: string, date: Date): Promise<IBooking[]>;
  findBookingWithinTimeRange(
    workerId: string,
    date: Date,
    startTime: Date,
    endTime: Date
  ): Promise<IBooking | null>;
  findByIdWithDetails(id: string): Promise<IBooking | null>;
  updateAdvancePaymentStatus(
    bookingId: string,
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<IBooking | null>;
   updateFinalPaymentStatus(
    bookingId: string,
    paymentIntentId: string,
    status: PaymentStatus
  ): Promise<IBooking | null>;
   findByWorkerAndRange(
    workerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<
    Array<{
      date: Date;
      startTime: string;
      endTime?: string | null;
      advancePaymentStatus?: "unpaid" | "paid" | "failed" | "refunded";
    }>
  >;
}
