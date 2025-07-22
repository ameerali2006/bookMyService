
export interface WorkerRegisterDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  category: "plumber" | "electrician" | "carpenter" | "mechanic" | "driver" | "chef"|"cleaner";
  experience: "0-1" | "2-5" | "6-10" | "10+";

  zone: string;
  latitude: string;  // Note: still string from frontend
  longitude: string;

  documents?: string; // Will be the file path or URL after upload
}
