import Stripe from "stripe"
import { PaymentStatus } from "../model/payement.model.interface"
export interface CreatePaymentIntenServicetInput {
  amount: number;
  currency: string;
  description: string;
  receiptEmail: string;
  metadata : {
    bookingId : string;
    vendorId : string;
    clientId : string;
  }
}
export interface IStripeService {
    createPaymentIntent(input : CreatePaymentIntenServicetInput): Promise<Stripe.PaymentIntent>
    updatePaymentStatus(paymentIntentId: string,status: PaymentStatus) : Promise<void>
    handleWebhookEvent(event : Stripe.Event) : Promise<void>
}