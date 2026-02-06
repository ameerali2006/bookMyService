import { Document, Types } from "mongoose";

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";

export interface IMessage extends Document{
  _id: Types.ObjectId;
  chatId: Types.ObjectId|string;
  senderId: Types.ObjectId|string;
  type: MessageType;
  content: string; // text OR Cloudinary URL
  metadata?: {
    fileName?: string;
    mimeType?: string;
  };
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
