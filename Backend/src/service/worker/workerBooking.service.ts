import { inject, injectable } from 'tsyringe';
import { IWorkerBookingService, serviceData } from '../../interface/service/worker/worker-booking.service.interface';
import { TYPES } from '../../config/constants/types';
import { IBookingRepository } from '../../interface/repository/booking.repository.interface';
import { doTimesOverlap, isTimeGreater } from '../../utils/time&Intervals';
import { IWalletService } from '../../interface/service/wallet.service.interface';
import { IUserRepository } from '../../interface/repository/user.repository.interface';
import { IEmailService } from '../../interface/helpers/email-service.service.interface';

@injectable()
export class WorkerBookingService implements IWorkerBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepo:IBookingRepository,
    @inject(TYPES.WalletService) private walletService:IWalletService,
    @inject(TYPES.AuthUserRepository) private userRepo:IUserRepository,
    @inject(TYPES.EmailService) private emailService:IEmailService
  ) {}
  async approveService(data: serviceData): Promise<{ success: boolean; message: string; }> {
    try {
      const { bookingId, endTime, additionalItems, additionalNotes } = data;

      const booking = await this.bookingRepo.findById(bookingId);

      if (!booking) {
        return { success: false, message: "Booking not found" };
      }

      
      if (!booking.startTime) {
        return { success: false, message: "Start time missing. User has not selected service time yet." };
      }
      

      if (!isTimeGreater(endTime,booking.startTime)) {
        return { success: false, message: "End time must be greater than start time" };
      }
      const workerBooking=await this.bookingRepo.findByWorkerId(booking.workerId.toString())
      const conflict=workerBooking.some(b=>{
        if(b.endTime){return doTimesOverlap(b.startTime,b.endTime,booking.startTime,endTime)}}
      )
      if(conflict){
        return { success: false, message: "Time conflict with another approved booking" };
      }
       if (additionalItems?.length) {
        for (const item of additionalItems) {
          if (!item.name || typeof item.price !== "number") {
            return { success: false, message: "Invalid additional item" };
          }
        }
      }

      const description = `${booking.description ?? ""}\nWorker Response: ${additionalNotes ?? ""}`;


      await this.bookingRepo.updateById(bookingId, {
        endTime,
        additionalItems: additionalItems || [],
        description,
        workerResponse: "accepted",
      });

      return { success: true, message: "Service approved successfully" };

    } catch (error){
      console.error(error);
      return { success: false, message: "Internal server error" };
    }
  }

  async rejectService(bookingId:string,description:string): Promise<{ success: boolean; message: string; }> {
    try {
      const booking = await this.bookingRepo.findById(bookingId);

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.workerResponse === "rejected") {
        throw new Error("Already rejected");
      }

     
      let refundAmount = 0;

      if (booking.advanceAmount > 0 && booking.advancePaymentStatus === "paid") {
        refundAmount = booking.advanceAmount;

        await this.walletService.addBalance({
          userId: booking.userId as string,
          amount: refundAmount,
          description: `Refund for rejected service (${booking.serviceId})`
        });

        booking.advancePaymentStatus = "refunded";
      }

      
      booking.status = "cancelled";
      booking.workerResponse = "rejected";
      booking.description =  description;

      await booking.save();

      
      const user = await this.userRepo.findById(booking.userId as string);

      if (user && user.email) {
        await this.emailService.sendServiceRejectedEmail({
          email: user.email,
          userName: user.name,
          serviceName: booking.serviceId.toString(),
          reason:description,
          refundAmount
        });
      }

      return {
        success:true,
        message: "Service rejected successfully",
      };
    
    } catch (error) {
      return {
        success:false,
        message:"something went wrong"
      }
    }
  }
}