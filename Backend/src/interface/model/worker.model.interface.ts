import { Document } from "mongoose";

export interface IWorker extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  googleId?: string;
  location: {
    lat: number;
    lng: number;
  };
  zone: string;
  experience: "0-1" | "2-5" | "6-10" | "10+";
  category: "plumber" | "electrician" | "carpenter" | "mechanic" | "driver" | "chef" | "cleaner";
  fees: number;
  isBlocked: boolean;
  isActive: boolean;
  isVerified: boolean;
  documents?: string;
  createdAt: Date;
  updatedAt: Date;
}