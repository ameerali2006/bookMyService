import { inject, injectable } from "tsyringe";
import { IBookingService } from "../../interface/service/services/bookingService.sevice.interface";
import { TYPES } from "../../config/constants/types";
import { IBookingRepository } from "../../interface/repository/booking.repository.interface";
import { IWorkerRepository } from "../../interface/repository/worker.repository.interface";
@injectable()
export class  BookingService implements IBookingService{
    constructor(
        @inject(TYPES.BookingRepository) private _bookingRepo:IBookingRepository,
        @inject(TYPES.WorkerRepository) private _workerRepo:IWorkerRepository,

    ) {}
    async setBasicBookingDetails(userId: string, workerId: string, time: string, date: Date, description: string): Promise<{ success: boolean; message: string; bookingId: string|null; }> {
        try {
            if(!userId||!workerId){
                return {
                    success:false,
                    message:"User not Found",
                    bookingId:null
                }
            }
            if (!time || !date || !description) {
                return {
                    success: false,
                    message: "Missing required fields (time, date, or description)",
                    bookingId: null,
                };
            }

           
            if (isNaN(new Date(date).getTime())) {
                return {
                    success: false,
                    message: "Invalid date format",
                    bookingId: null,
                };
            }
            const workerData=await this._workerRepo.findById(workerId)

            if(!workerData){
                return {
                    success: false,
                    message: "worker is not found",
                    bookingId: null,
                };
            }
            const bookingDate = new Date(date);
            const [hours, minutes] = time.split(":").map(Number);
            bookingDate.setHours(hours, minutes, 0, 0);
            const startTime = new Date(bookingDate);
            const endTime = new Date(bookingDate.getTime() + 60 * 60 * 1000);

            const existingBooking = await this._bookingRepo.findBookingWithinTimeRange(
                workerId,
                date,
                startTime,
                endTime
            )
            if (existingBooking) {
                return {
                    success: false,
                    message: "Worker already has a booking within this time slot",
                    bookingId: null,
                };
            }
            const newBooking = await this._bookingRepo.create({
                userId,
                workerId,
                serviceId:workerData.category,
                date: bookingDate,
                startTime:time,
                description,
                status: "pending",
                advancePaymentStatus: "unpaid",
            });

            if (!newBooking) {
            return {
                success: false,
                message: "Failed to create booking",
                bookingId: null,
            };
            }

            return {
                success: true,
                message: "Booking created successfully",
                bookingId: newBooking._id.toString(),
            };

        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: "internal Error",
                bookingId: null,
            };
        }
    }
}