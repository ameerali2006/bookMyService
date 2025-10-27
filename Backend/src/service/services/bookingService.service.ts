import { inject, injectable } from "tsyringe";
import { BookingDetails, IBookingService } from "../../interface/service/services/bookingService.sevice.interface";
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
    async getBookingDetails(bookingId: string): Promise<{ success: boolean; message: string; details: BookingDetails | null; }> {
        try {
            if(!bookingId){
                return {
                    success:false,
                    message:"booking details not found",
                    details:null

                }
            }

            const booking=await this._bookingRepo.findByIdWithDetails(bookingId)
            if(!booking){
                return {
                    success:false,
                    message:"booking details not found",
                    details:null

                }
            }
            const worker = booking.workerId as unknown as { name?: string };
            const service = booking.serviceId as unknown as { category?: string };

            let time= `${Number(booking.startTime.split(":")[0])%12}:${booking.startTime.split(":")[1]} `
            Number(booking.startTime.split(":")[0])%12== Number(booking.startTime.split(":")[0])?time+=" AM":time+=" PM"
            const data ={
                workerName: worker.name as string,
                serviceName: service.category as string,
                date: booking.date.toISOString().split("T")[0],
                time,
                description:booking.description as string,
                
                advance: booking.advanceAmount
            }
            return {
                success:true,
                message:"booking details  found",
                details:data
            }


        } catch (error) {
            return {
                    success:false,
                    message:"internal error",
                    details:null

            }
        }
    }
}