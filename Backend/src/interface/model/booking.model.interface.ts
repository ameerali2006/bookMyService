import { Document, Types } from 'mongoose';
import { IWorker } from './worker.model.interface';
import { IUser } from './user.model.interface';
import { IService } from './service.model.interface';
import { IAddress } from './address.model.interface';

export interface IAdditionalItem{
  name: string;
  price: number;
}

export interface IRating {
  score?: number;
  review?: string;
}

export interface IBooking extends Document{
  _id: Types.ObjectId;

  userId: Types.ObjectId|string;
  workerId: Types.ObjectId|string;
  serviceId: Types.ObjectId|string;
  address: Types.ObjectId|string;

  date: Date;
  startTime: string;
  endTime?: string;
  description?: string;

  advanceAmount: number;
  totalAmount?: number;
  remainingAmount?: number;

  advancePaymentId?: string;
  advancePaymentStatus?: 'unpaid' | 'paid' | 'failed' | 'refunded';

  finalPaymentId?: string;
  finalPaymentStatus?: 'unpaid' | 'paid' | 'failed' | 'refunded';

  paymentMethod?: 'stripe' | 'upi' | 'cash';

  additionalItems?: IAdditionalItem[];

  status:
    | 'pending'
    | 'confirmed'
    | 'in-progress'
    | 'awaiting-final-payment'
    | 'completed'
    | 'cancelled';

  workerResponse?: 'accepted' | 'rejected' | 'pending';

  otp?: string;

  rating?: IRating;

  createdAt?: Date;
  updatedAt?: Date;
}
export type IBookingPopulated = Omit<IBooking, 'workerId' | 'userId' | 'serviceId'|'address'> & {
  workerId: IWorker;
  userId: IUser;
  serviceId: IService;
  address:IAddress
};
