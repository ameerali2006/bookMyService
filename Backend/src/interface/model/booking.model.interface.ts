import { Schema, model, Document, Types } from "mongoose";

export interface IBooking extends Document {
  userId: Types.ObjectId;           
  workerId: Types.ObjectId;        
  serviceId: Types.ObjectId;        
  date: Date;                       
  startTime: string;                
  endTime?: string;                 
  description?: string;             
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded" | "failed";
  paymentMethod?: "stripe" | "razorpay" | "upi" | "cash";
  paymentId?: string;              
  totalAmount?: number;
  workerResponse: "accepted" | "rejected" | "pending";
  address?: Types.ObjectId;       
  otp?: string;                     
  rating?: { score: number; review?: string };
  createdAt: Date;
  updatedAt: Date;
}