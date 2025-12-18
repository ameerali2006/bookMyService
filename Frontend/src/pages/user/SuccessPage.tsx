import React, { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { userService } from "@/api/UserService"
import { ErrorToast } from "@/components/shared/Toaster"


const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate()
  const { bookingId } = useParams<{ bookingId: string }>()
  const [searchParams] = useSearchParams();
  const rawType = searchParams.get("type");
  const type: "advance" | "final" = rawType === "advance" ? "advance" : "final";
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const confettiRef = useRef(false)

  useEffect(() => {
    if (!bookingId) return

    const fetchPaymentData = async () => {
      try {
        const res = await userService.verifyPayment(bookingId,type)
        console.log(res)
        if(res.data.success){
          setPaymentData(res.data.data)
        }else{
          ErrorToast(res.data.message||"Something went wrong")
        }
        
      } catch (error) {
        console.error("Payment fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [bookingId])

  useEffect(() => {
    if (confettiRef.current || loading) return
    confettiRef.current = true

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Verifying payment...
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-bold">
        Payment verification failed.
      </div>
    )
  }

  const msg =
    paymentData.type === "advance"
      ? {
          title: "🎉 Advance Payment Successful!",
          subtitle: "Your advance has been received!",
        }
      : {
          title: "✅ Final Payment Successful!",
          subtitle: "Your booking is now fully paid.",
        }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in duration-500 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl md:text-3xl font-bold">{msg.title}</h1>
          <p className="text-muted-foreground">{msg.subtitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <Info label="Booking ID" value={bookingId} />
            <Info label="Amount Paid" value={paymentData.amountPaid} />
            <Info label="Payment Type" value={paymentData.type} />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={() => navigate(`/bookings/${bookingId}`)} size="lg">
              View Booking Details
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Info = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
)

export default PaymentSuccessPage
