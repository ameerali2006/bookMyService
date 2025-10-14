export interface IBookingService{
    setBasicBookingDetails(userId:string,workerId:string,time:string,date:Date,description:string):Promise<{success:boolean,message:string,bookingId:string|null}>
}