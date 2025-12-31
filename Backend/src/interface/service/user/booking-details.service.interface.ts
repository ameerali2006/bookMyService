import { bookingDetailDataResponseDto, BookingDetailDto, ongoingBookingDto, ongoingBookingsResponseDto } from "../../../dto/user/booking-details.dto";

export interface IBookingDetailsService{
    ongoingBookings(userId:string,limit:number,skip:number,search:string):Promise<ongoingBookingsResponseDto>
    bookingDetailData(bookingId:string):Promise<bookingDetailDataResponseDto>
}