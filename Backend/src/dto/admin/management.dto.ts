export interface userManageDto{
    _id:string,
    name:string,
    email:string,
    phone:string,
    image?:string,
    isBlocked:boolean,
    createdAt:Date

}
export interface workerManageDto {
  _id: string
  name: string
  email: string
  phone?: string
  isBlocked: boolean
  isVerified: string
  category: string
  experience: string
  profileImage?: string
  createdAt: Date
}
export interface serviceCreateDto{

  category: string;
  description: string;
  price: number;
  priceUnit: 'per hour'| 'per job'| 'per item';
  duration: number;
  image: string;

  status: 'active' | 'inactive';

}
export interface serviceManageDto extends serviceCreateDto {
  _id: string;
  createdAt: Date;
}
export interface AdminBookingDto {
  id: string
  customerName: string
  workerName: string
  serviceName: string
  date: Date
  startTime: string
  endTime?: string
  status: "pending" | "confirmed" | "in-progress" | "awaiting-final-payment" | "completed" | "cancelled"
  createdAt: Date
}
