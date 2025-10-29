  
export interface WorkerProfileDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  experience: string;
  zone: string;
  category: string;
  fees: number;
  isActive: boolean;
  isVerified: "pending" | "approved" | "rejected";
  location: {
    lat: number;
    lng: number;
  };
  documents?: string;
}
