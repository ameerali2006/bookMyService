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
  zone: string;
  experience: "0-1" | "2-5" | "6-10" | "10+";
  category: "plumber" | "electrician" | "carpenter" | "mechanic" | "driver" | "chef"|"cleaner";
  fees: number;
  isBlocked: boolean;
  isActive: boolean;
  isVerified: boolean;
  documents?: string;
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

    zone: { type: String, required: true, trim: true },

    experience: {
      type: String,
      enum: ["0-1", "2-5", "6-10", "10+"],
      required: true,
    },

    category: {
      type: String,
      enum: ["plumber", "electrician", "carpenter", "mechanic", "driver", "chef"],
      required: true,
    },

    fees: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: true },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    documents: { type: String },
  },
  {
    timestamps: true,
  }
);

export const WorkerModel = mongoose.model<IWorker>('Worker', WorkerSchema);
