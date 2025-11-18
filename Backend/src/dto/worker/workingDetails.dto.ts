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
  isVerified: 'pending' | 'approved' | 'rejected';
  location: {
    lat: number;
    lng: number;
  };
  documents?: string;
}
export interface ServiceRequest {
  id: string;
  serviceName: string;
  userName: string;
  date: string;
  time: string;
  location?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  userLocation: { lat: number; lng: number };
  notes?: string;
  phone: string;
}
