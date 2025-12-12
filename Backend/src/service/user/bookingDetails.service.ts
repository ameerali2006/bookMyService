import { inject, injectable } from "tsyringe";
import { TYPES } from "../../config/constants/types";
import { BookingDetailDto, ongoingBookingDto } from "../../dto/user/bookingDetails.dto";
import { IBookingRepository } from "../../interface/repository/booking.repository.interface";
import { IBookingDetailsService } from "../../interface/service/user/bookingDetails.service.interface";
import { UserMapper } from "../../utils/mapper/user-mapper";
import { string } from "zod";
@injectable()
export class BookingDetailsService implements IBookingDetailsService{
    constructor(
        @inject(TYPES.BookingRepository) private bookingRepo:IBookingRepository
    ){}
    async ongoingBookings(userId:string,limit: number, skip: number, search: string): Promise<{ success: boolean; message: string; data?: { data: ongoingBookingDto[]; total: number; }; }> {
        try {
            

           
            const statuses = ["pending", "confirmed", "in-progress","awaiting-final-payment"];
            const workerResponses = ["pending","accepted"]; 

            
            const {bookings,total} = await this.bookingRepo.findBookingListByUserId(
                userId,
                statuses,
                workerResponses,
                limit,
                skip,
                search
            );

        
            console.log(bookings)
            if (!bookings) {
                return {
                    success: false,
                    message: "No bookings found",
                };
            }

            
            const formatted=UserMapper.ongoingBooking(bookings)

            return {
                success: true,
                message: "Ongoing bookings fetched successfully",
                data: {
                    data: formatted,
                    total,
                },
            };
        } catch (error) { 
            return{
                success:false,
                message:"internal Error"
            }
        }
    }
    async bookingDetailData(bookingId: string): Promise<{ success: boolean; message: string; booking?: BookingDetailDto; }> {
        try {
            if(!bookingId){
                return {success :false,message:"bookiing detail is missing"}
            }
            const bookingData=await this.bookingRepo.findByIdPopulated(bookingId)
            if(!bookingData){
                return {success :false,message:"booking not fount"}
            }
            const dtoData=UserMapper.bookingDetail(bookingData)
            return {success :true,message:"successfully fetched data",booking:dtoData}

        } catch (error) {
            console.log(error)
            return{
                success:false,
                message:"internal Error"
            }
        }
    }


}