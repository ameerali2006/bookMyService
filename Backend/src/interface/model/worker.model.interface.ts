import { Document, Types } from "mongoose";
import { IService } from "./service.model.interface";

export interface IWorker  extends Document{
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
  googleId?: string;
  location: {
    lat: number;
    lng: number;
  };
  zone: string;
  experience: "0-1" | "2-5" | "6-10" | "10+";
  category: Types.ObjectId
  fees: number;
  isBlocked: boolean;
  isActive: boolean;
  isVerified: boolean;
  documents?: string;
  createdAt: Date;
  updatedAt: Date;
}