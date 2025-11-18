import { Document, Types } from 'mongoose';

export type CreatorType = 'Client' | 'Worker' | 'Admin';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type Purpose =
  | 'vendor-booking'
  | 'refund-amount'
  | 'wallet-credit'
  | 'commission-credit'
  | 'advance-payment'
  | 'final-payment';

export interface IPayment extends Document {
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  bookingId?: Types.ObjectId;
  creatorType: CreatorType;
  receiverType: CreatorType;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentIntentId?: string;
  purpose: Purpose;
  createdAt?: Date;
  updatedAt?: Date;
}
