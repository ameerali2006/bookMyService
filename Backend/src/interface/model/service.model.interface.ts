import { Document } from "mongoose";

export interface IService extends Document {
  category: string;
  description: string;
  price: number;
  priceUnit: "per hour"| "per job"| "per item"; 
  duration: number; 
  images: string[];
  icon: string; 
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
