import { Types } from "mongoose";

export interface WorkerRegisterDTO {
  name: string;
  email: string;
  phone: string;
  password?: string;
  

  category: Types.ObjectId;
  experience: "0-1" | "2-5" | "6-10" | "10+";

  zone: string;
  latitude: string;  
  longitude: string;

  documents?: string; 
  role:"worker"
  
  
}

export interface responseDto{
  name:string,
  email:string,
  image?:string
}
export interface GoogleLoginResponseDTO {
  success: boolean;
  message: string;
  accessToken:string|null;
  refreshToken:string|null;
  user: {
    _id?: string;
    name: string;
    email: string;
    googleId: string;
    image: string | null;
  }|null;   
  isNew: boolean;
}