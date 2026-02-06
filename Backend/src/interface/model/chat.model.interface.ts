import { Document, Types } from "mongoose";

export interface IChat extends Document {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
