import { Types } from "mongoose";

export interface WorkerRegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  category: Types.ObjectId;
  experience: "0-1" | "2-5" | "6-10" | "10+";

  zone: string;
  latitude: string;  // Note: still string from frontend
  longitude: string;

  documents?: string; // Will be the file path or URL after upload
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
    profileImage: string | null;
  }|null;
  isNew: boolean;
}