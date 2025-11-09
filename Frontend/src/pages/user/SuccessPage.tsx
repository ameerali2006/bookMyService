import React, { useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate()
  const { bookingId } = useParams<{ bookingId: string }>()
  const location = useLocation()
  const confettiRef = useRef(false)

  // Extract query params
  const searchParams = new URLSearchParams(location.search)
  const paymentType = searchParams.get("type") || "advance"
  const amountPaid = searchParams.get("amount") || "$100.00"

  const messages = {
    advance: {
      title: "🎉 Advance Payment Successful!",
      subtitle: "Your advance has been received. The worker will confirm your service soon.",
    },
    final: {
      title: "✅ Final Payment Successful!",
      subtitle: "Your booking is now fully paid. Thank you for trusting our service.",
    },
  }

  const currentMessage = messages[paymentType as keyof typeof messages] || messages.advance

  useEffect(() => {
    if (confettiRef.current) return
    confettiRef.current = true

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in duration-500 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center mb-2">
            <div className="animate-in zoom-in duration-700 delay-100">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{currentMessage.title}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{currentMessage.subtitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Booking ID</span>
              <span className="font-mono font-semibold text-foreground text-sm">{bookingId}</span>
            </div>
            <div className="border-t border-border pt-3" />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Amount Paid</span>
              <span className="font-semibold text-foreground">{amountPaid}</span>
            </div>
            <div className="border-t border-border pt-3" />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Payment Type</span>
              <span className="font-semibold text-foreground capitalize">{paymentType}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={() => navigate(`/booking/${bookingId}`)} className="w-full" size="lg">
              View Booking Details
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full" size="lg">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentSuccessPage
