import { IPaymentItem } from "../../interface/model/booking.model.interface"

export interface ongoingBookingDto{
    id: string
    serviceName: string
    workerName: string
    date: string
    time: string
    status: 'accepted' | 'rejected' | 'pending'
}
export interface BookingDetailDto {
  id: string
  serviceName: string
  description?: string
  date: string
  startTime: string
  endTime?: string
  workerName: string
  workerImage: string
  contact: string
  address: string
  advanceAmount: number
  totalAmount: number
  remainingAmount: number
  advancePaymentStatus: "unpaid" | "paid" | "failed" | "refunded"
  finalPaymentStatus: "unpaid" | "paid" | "failed" | "refunded"
  paymentMethod?: "stripe" | "upi" | "cash"
  additionalItems?: { name: string;  price: number }[]
  paymentItems?:IPaymentItem[]
  status:
    | "pending"
    | "confirmed"
    | "in-progress"
    | "awaiting-final-payment"
    | "completed"
    | "cancelled"
  workerResponse: "accepted" | "rejected" | "pending"
  otp?: string
}






