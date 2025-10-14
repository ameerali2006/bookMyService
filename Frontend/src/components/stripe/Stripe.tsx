"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Replace with your own test public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const DemoPaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
console.log('huuuuuuuuuuuuuuuuuu')
  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Normally you'd fetch a clientSecret from your backend here
      const clientSecret = "demo_client_secret_placeholder";

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        alert(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        alert("Payment successful 🎉");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-lg">Demo Stripe Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "apple_pay", "google_pay"],
          }}
          onChange={(event) => setIsPaymentValid(event.complete)}
        />

        <Button
          onClick={handlePayment}
          disabled={loading || !stripe || !elements || !isPaymentValid}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Pay ₹100.00"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          🔒 This is a demo payment form (no real charges will be made)
        </p>
      </CardContent>
    </Card>
  );
};

export const DemoPaymentWrapper: React.FC<{ name: string }> = (prop : {name : string}) => {
  const stripeOptions = {
    mode: "payment" as const,
    amount: 10000, // ₹100.00
    currency: "inr",
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#2563eb",
        borderRadius: "8px",
      },
    },
  };

  console.log(prop.name)
  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <DemoPaymentForm />
    </Elements>
  );
};
