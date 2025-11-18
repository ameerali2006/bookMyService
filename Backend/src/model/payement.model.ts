import {
  Schema, model, Types, Document,
} from 'mongoose';
import { IPayment } from '../interface/model/payement.model.interface';

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },

    creatorType: { type: String, enum: ['Client', 'Worker', 'Admin'], required: true },
    receiverType: { type: String, enum: ['Client', 'Worker', 'Admin'], required: true },

    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'inr' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    paymentIntentId: { type: String },
    purpose: {
      type: String,
      enum: [
        'vendor-booking',
        'refund-amount',
        'wallet-credit',
        'commission-credit',
        'advance-payment',
        'final-payment',
      ],
      required: true,
    },
  },
  { timestamps: true },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
