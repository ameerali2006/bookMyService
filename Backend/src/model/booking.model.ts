import { Schema, model  } from "mongoose";
import { IBooking } from "../interface/model/booking.model.interface";


const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },

    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String }, // worker sets later
    description: { type: String },

    address: { type: Schema.Types.ObjectId, ref: "Address" },

    // 🧾 Payment Details
    advanceAmount: { type: Number, required: true ,default:0},
    totalAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },

    advancePaymentId: { type: String },
    advancePaymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },

    finalPaymentId: { type: Schema.Types.ObjectId },
    finalPaymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "upi", "cash"],
    },

    // Worker-added items or charges
    additionalItems: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],

    status: {
      type: String,
      enum: [
        "pending",      // just booked
        "confirmed",    // advance paid
        "in-progress",  // worker started work
        "awaiting-final-payment", // work done, waiting for remaining payment
        "completed",    // all done
        "cancelled",
      ],
      default: "pending",
    },

    workerResponse: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },

    otp: { type: String },

    rating: {
      score: { type: Number, min: 1, max: 5 },
      review: String,
    },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", BookingSchema);
