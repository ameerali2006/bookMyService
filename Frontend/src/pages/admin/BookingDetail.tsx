import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/admin/Navbar"
import Sidebar from "@/components/admin/Sidebar"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { adminManagement } from "@/api/AdminManagement"
import { ErrorToast } from "@/components/shared/Toaster"
import type { AdminBookingDetailsDto } from "@/interface/admin/booking"

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "in-progress":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "completed":
      return "bg-green-50 text-green-700 border-green-200"
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

function isToday(dateString: string) {
  const today = new Date()
  const date = new Date(dateString)
  return today.toDateString() === date.toDateString()
}

export default function AdminBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<AdminBookingDetailsDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!bookingId) return

    const fetchBooking = async () => {
      try {
        const response = await adminManagement.getBookingDetailPage(bookingId)
        setBooking(response.data.booking)
      } catch (error) {
        ErrorToast("Failed to load booking details")
        navigate("/admin/bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        Loading booking...
      </div>
    )
  }

  if (!booking) return null

  const googleMapsUrl = `https://www.google.com/maps?q=${booking.address.lat},${booking.address.lng}`

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Sidebar
        activeItem="WorkerManagement"
        onItemClick={() => {}}
        onLogout={() => {
          localStorage.removeItem("adminToken")
          sessionStorage.clear()
          navigate("/admin/login")
        }}
      />
      <Navbar userName="Admin" onSearch={setSearch} />

      <main className="ml-64 pt-16 px-10 pb-16">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Booking Details
              </p>
              <div className="flex items-center gap-4 mt-2">
                <h1 className="text-3xl font-bold tracking-wide text-[#0B1F3A]">
                  #{booking.id}
                </h1>
                <Badge variant="outline" className={cn("border", getStatusColor(booking.status))}>
                  {booking.status}
                </Badge>
                {isToday(booking.bookingDate.toString()) && (
                  <Badge className="bg-[#F4B400] text-white">Today</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-8">

            {/* Customer + Worker */}
            <div className="grid lg:grid-cols-2 gap-8">

              <Card className="shadow-sm border rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[#0B1F3A] font-semibold">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={booking.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {booking.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{booking.customer.name}</p>
                      <p className="text-gray-500">{booking.customer.phone}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-gray-600">
                    <p>{booking.address.street}</p>
                    <p>
                      {booking.address.city}, {booking.address.state} {booking.address.pinCode}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      className="text-[#0B1F3A] hover:underline inline-flex items-center gap-1 mt-2"
                    >
                      Open in Google Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[#0B1F3A] font-semibold">
                    Worker Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold">{booking.worker.name}</p>
                  <p className="text-gray-500">{booking.worker.phone}</p>
                  <p className="text-gray-500">{booking.worker.email}</p>
                </CardContent>
              </Card>
            </div>

            {/* Service + Payment */}
            <div className="grid lg:grid-cols-2 gap-8">

              <Card className="shadow-sm border rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[#0B1F3A] font-semibold">
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Service:</span> {booking.service.name}</p>
                  <p><span className="text-gray-400">Category:</span> {booking.service.category}</p>
                  <p><span className="text-gray-400">Duration:</span> {booking.service.duration} mins</p>
                  <p><span className="text-gray-400">Time Slot:</span> {booking.timeSlot}</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border rounded-xl">
                <CardHeader>
                  <CardTitle className="text-[#0B1F3A] font-semibold">
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Advance</span>
                    <span>${booking.payment.advanceAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    <span>${booking.payment.remainingAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold text-[#0B1F3A]">
                    <span>Total</span>
                    <span>${booking.payment.totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}