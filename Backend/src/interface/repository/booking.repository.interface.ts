import { IBooking } from "../model/booking.model.interface";

export interface IBookingRepository {
  createBooking(data: Partial<IBooking>): Promise<IBooking>;
  findById(id: string): Promise<IBooking | null>;
  findByUserId(userId: string): Promise<IBooking[]>;
  findByWorkerId(workerId: string): Promise<IBooking[]>;
  updateStatus(id: string, status: string): Promise<IBooking | null>;
  updateWorkerResponse(id: string, response: string): Promise<IBooking | null>;
  updatePaymentStatus(id: string, paymentStatus: string, paymentId?: string): Promise<IBooking | null>;
  addRating(id: string, score: number, review?: string): Promise<IBooking | null>;
  cancelBooking(id: string): Promise<IBooking | null>;
  findByWorkerAndDate(workerId: string, date: Date): Promise<IBooking[]>;
}