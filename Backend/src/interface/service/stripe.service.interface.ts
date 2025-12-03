import Stripe from 'stripe';
import { PaymentStatus } from '../model/payement.model.interface';

export interface CreatePaymentIntenServicetInput {
  amount: number;
  currency: string;
  description: string;
  receiptEmail: string;
  metadata : {
    bookingId : string;
    addressId : string;
    paymentType : string;
  }
}
export interface IStripeService {
    createPaymentIntent(input : CreatePaymentIntenServicetInput): Promise<{success:boolean, message:string, paymentIntent:Stripe.PaymentIntent|null}>
    updatePaymentStatus(paymentIntentId: string, status: PaymentStatus) : Promise<void>
    handleWebhookEvent(event : Stripe.Event) : Promise<void>
}
