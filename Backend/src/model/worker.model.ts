import mongoose, { Schema, Document } from 'mongoose';

export interface IWorker extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;

  
  location: {
    lat: number;
    lng: number;
  };
  

  serviceCategory: string;
  fees: number;
  isBlocked:boolean
  isActive: boolean;
  isVerified: boolean;
  documents: {
    aadhar?: string;
    license?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema: Schema = new Schema<IWorker>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },

   

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    

    serviceCategory: { type: String, required: true },
    fees: { type: Number, default: 0 },
    isActive:{type:Boolean, default:false},
    isBlocked: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    documents: {
      aadharImg: { type: String },
      licenseImg: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const WorkerModel = mongoose.model<IWorker>('Worker', WorkerSchema);
