
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Briefcase,
  DollarSign,
  Star,
  ChevronDown,
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
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
    case "in-progress":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
    case "completed":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
    case "cancelled":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function isToday(dateString: string) {
  const today = new Date()
  const date = new Date(dateString)
  return today.toDateString() === date.toDateString()
}

export default async function AdminBookingDetailsPage() {
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
    return <div className="p-10 text-center">Loading booking...</div>
  }

  if (!booking) return null 

  const googleMapsUrl = `https://www.google.com/maps?q=${booking.address.lat},${booking.address.lng}`
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem="WorkerManagement" onItemClick={() => {}} onLogout={() => {
        localStorage.removeItem("adminToken")
        sessionStorage.clear()
        navigate("/admin/login")
      }} />
      <Navbar userName="Admin" onSearch={setSearch} />

     <main className="ml-64 pt-16">
        <div className="container max-w-5xl py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold font-mono">#{booking.id}</h1>
                <Badge variant="outline" className={cn("border", getStatusColor(booking.status))}>
                  {booking.status}
                </Badge>
                {isToday(booking.bookingDate.toString()) && <Badge variant="secondary">Today</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Booking Date:{" "}
                {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-muted/30 rounded-lg p-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={booking.customer.avatar || "/placeholder.svg"} alt={booking.customer.name} />
                  <AvatarFallback>
                    {booking.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-semibold text-lg">{booking.customer.name}</p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.customer.phone}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p>{booking.address.street}</p>
                        <p className="text-muted-foreground">
                          {booking.address.city}, {booking.address.state}{" "}
                          {booking.address.pinCode}
                        </p>
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
                        >
                          Open in Google Maps
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Worker Information - Admin Only */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Worker Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={booking.worker.avatar || "/placeholder.svg"} alt={booking.worker.name} />
                  <AvatarFallback>
                    {booking.worker.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-semibold text-lg">{booking.worker.name}</p>
                    <Badge variant={booking.worker.response === "accepted" ? "default" : "secondary"} className="mt-1">
                      {booking.worker.response}
                    </Badge>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.worker.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.worker.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service Name</p>
                  <p className="font-semibold">{booking.service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{booking.service.category}</p>
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Slot</p>
                    <p className="font-medium">{booking.timeSlot}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{booking.service.duration} minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline - Read Only */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-6">
                  {booking.timeline.map((item, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div
                        className={cn(
                          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                          item.completed ? "bg-primary border-primary" : "bg-background border-muted",
                        )}
                      >
                        {item.completed && <div className="h-3 w-3 rounded-full bg-primary-foreground" />}
                      </div>

                      <div className="flex-1 pt-1">
                        <p
                          className={cn(
                            "font-medium capitalize",
                            item.completed ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {item.status.replace("-", " ")}
                        </p>
                        {item.date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Description */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Description</CardTitle>
            </CardHeader>
            <CardContent>
              {booking.description ? (
                <p className="text-sm leading-relaxed">{booking.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No description provided</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Items - Read Only */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Items</CardTitle>
            </CardHeader>
            <CardContent>
              {booking.additionalItems.length > 0 ? (
                <div className="space-y-3">
                  {booking.additionalItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold">Total Additional Items</span>
                    <span className="font-semibold text-lg">
                      ${booking.additionalItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No additional items</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Advance Amount</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">${booking.payment.advanceAmount.toFixed(2)}</p>
                    <Badge variant={booking.payment.advancePaid ? "default" : "secondary"}>
                      {booking.payment.advancePaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Remaining Amount</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">${booking.payment.remainingAmount.toFixed(2)}</p>
                    <Badge variant={booking.payment.finalPaid ? "default" : "secondary"}>
                      {booking.payment.finalPaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">${booking.payment.totalAmount.toFixed(2)}</span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{booking.payment.paymentMethod}</p>
              </div>

              {booking.payment.breakdown && booking.payment.breakdown.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:text-primary transition-colors">
                    <span className="font-medium">Payment Breakdown</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="space-y-2 rounded-lg border p-4">
                      {booking.payment.breakdown.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 text-sm">
                          <span className="col-span-2 font-medium">{item.title}</span>
                          <span className="text-right text-muted-foreground">
                            ${item.rate} × {item.quantity}
                          </span>
                          <span className="text-right font-semibold">${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CardContent>
          </Card>

          {/* Rating & Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Rating & Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.rating ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => {
                      const stars = booking.rating?.stars ?? 0

                      return (
                        <Star
                          key={i}
                          className={cn(
                            "h-5 w-5",
                            i < stars
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          )}
                        />
                      )
                    })}
                    <span className="font-semibold text-lg ml-2">
                      {(booking.rating?.stars ?? 0)}.0
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                    {booking.rating?.review}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Not rated yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
