export interface serviceData{
    bookingId: string;
    serviceName: string;
    endTime: string;
    additionalItems?: {
        name: string;
        price: number;
    }[] ;
    additionalNotes?: string ;
}
export interface  IWorkerBookingService{
    approveService(data:serviceData):Promise<{success:boolean, message:string,}>
    rejectService(bookingId:string,description:string):Promise<{success:boolean, message:string,}>
}
