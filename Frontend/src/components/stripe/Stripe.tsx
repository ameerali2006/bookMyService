"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userService } from "@/api/UserService";
import { useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "../shared/Toaster";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

/* -------------------------- Payment Form Component -------------------------- */
const PaymentForm = ({
  totalAmount,
  bookingId,
  paymentType,
}: {
  totalAmount: number;
  bookingId: string;
  paymentType: "advance" | "final";
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const user = useSelector((state: RootState) => state.userTokenSlice.user);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    if (!user?.email) {
      ErrorToast("Please login to continue payment");
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        ErrorToast(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        SuccessToast(
          `${paymentType === "advance" ? "Advance" : "Final"} payment successful!`
        );

        // 👇 Different redirect based on payment type
        setTimeout(() => {
          window.location.href = `/booking/${bookingId}/success?type=${paymentType}`;
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      ErrorToast("Something went wrong while processing your payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          {paymentType === "advance" ? "Advance Payment" : "Final Payment"}
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Amount to pay: ₹{totalAmount.toFixed(2)}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "apple_pay", "google_pay"],
          }}
          onChange={(e) => setIsPaymentValid(e.complete)}
        />

        <Button
          onClick={handlePayment}
          disabled={loading || !stripe || !elements || !isPaymentValid}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
        >
          {loading
            ? "Processing..."
            : `Pay ₹${totalAmount} (${paymentType === "advance" ? "Advance" : "Final"})`}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          🔒 Secure payment powered by Stripe
        </p>
      </CardContent>
    </Card>
  );
};


/* -------------------------- Payment Wrapper Component -------------------------- */
export const PaymentWrapper = ({
  totalAmount,
  paymentType,
}: {
  totalAmount: number;
  paymentType: "advance" | "final";
}) => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const user = useSelector((state: RootState) => state.userTokenSlice.user);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      try {
        if (!user?.email || !bookingId) {
          ErrorToast("Missing user or booking information");
          return;
        }

        // 👇 Custom description based on paymentType
        const description =
          paymentType === "advance"
            ? `Advance payment for booking ${bookingId}`
            : `Final payment for booking ${bookingId}`;

        const res = await userService.createPaymentIntent({
          amount: totalAmount * 100,
          currency: "inr",
          description,
          receiptEmail: user.email,
          metadata: { bookingId, paymentType },
        });

        if (res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          ErrorToast("Failed to initialize payment");
        }
      } catch (err) {
        console.error(err);
        ErrorToast("Error creating payment intent");
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [totalAmount, bookingId, user?.email, paymentType]);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#2563eb",
      borderRadius: "8px",
    },
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-muted-foreground">
        Initializing payment...
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center mt-10 text-red-500">
        Payment could not be initialized. Please try again.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <PaymentForm
        totalAmount={totalAmount}
        bookingId={bookingId!}
        paymentType={paymentType}
      />
    </Elements>
  );
};
