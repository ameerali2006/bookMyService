export interface BookingDetails {
    workerName: string;
    serviceName: string;
    date: string;
    time: string;
    description: string;
    advance: number;}
export interface IBookingService{
    setBasicBookingDetails(userId:string,workerId:string,time:string,date:Date,description:string):Promise<{success:boolean,message:string,bookingId:string|null}>
    getBookingDetails(bookingId:string):Promise<{success:boolean ,message:string,details:BookingDetails|null}>
}