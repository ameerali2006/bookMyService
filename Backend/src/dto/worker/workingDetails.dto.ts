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
  availableTime?:string;
  location?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  userLocation: { lat: number; lng: number };
  notes?: string;
  phone: string;
}
export interface ApprovedServices {
  id: string
  customerName: string
  serviceName: string
  date: Date
  startTime: string
  endTime?: string
  
  status: "confirmed" | "in-progress"|'awaiting-final-payment'
}
export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}
export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  location: ILocation;
}


export interface IWorkerRequestResponse {
  
  data: ServiceRequest[];
  page: number;
  total: number;
}
