import { Schema, model, Types } from "mongoose";
import { IChat } from "../interface/model/chat.model.interface";


const chatSchema = new Schema<IChat>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, 
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = model<IChat>("Chat", chatSchema);
