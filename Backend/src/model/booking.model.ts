import { model, Schema } from "mongoose";
import { IBooking } from "../interface/model/booking.model.interface";

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    workerResponse: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "upi", "cash"],
    },
    paymentId: { type: String },
    totalAmount: { type: Number },
    otp: { type: String },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      review: String,
    },
    address: { type: Schema.Types.ObjectId, ref: "Address"},
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", BookingSchema);