import { BookingDetailDto, ongoingBookingDto } from "../../../dto/user/bookingDetails.dto";

export interface IBookingDetailsService{
    ongoingBookings(userId:string,limit:number,skip:number,search:string):Promise<{success:boolean,message:string,data?:{data:ongoingBookingDto[],total:number}}>
    bookingDetailData(bookingId:string):Promise<{success:boolean,message:string,booking?:BookingDetailDto}>
}