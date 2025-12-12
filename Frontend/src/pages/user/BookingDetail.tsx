"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  MapPin,
  Phone,
  Check,
  Clock,
  QrCode,
  Trash2,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ZapOff,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { userService } from "@/api/UserService"
import { ErrorToast } from "@/components/shared/Toaster"
import Header from "@/components/user/shared/Header"
import Footer from "@/components/user/shared/Footer"

// -----------------------
// INTERFACE
// -----------------------
interface BookingDetail {
  id: string
  serviceName: string
  description?: string
  date: string
  startTime: string
  endTime?: string
  workerName: string
  workerImage: string
  contact: string
  address: string
  advanceAmount: number
  totalAmount: number
  remainingAmount: number
  advancePaymentStatus: "unpaid" | "paid" | "failed" | "refunded"
  finalPaymentStatus: "unpaid" | "paid" | "failed" | "refunded"
  paymentMethod: "stripe" | "upi" | "cash"
  additionalItems?: { name: string; qty: number; price: number }[]
  status: "pending" | "confirmed" | "in-progress" | "awaiting-final-payment" | "completed" | "cancelled"
  workerResponse: "accepted" | "rejected" | "pending"
  otp?: string
}

const statusSteps = ["pending", "confirmed", "in-progress", "awaiting-final-payment", "completed"]

// -----------------------
// COLOR HELPERS
// -----------------------
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-200"
    case "confirmed":
      return "bg-blue-50 text-blue-700 border border-blue-200"
    case "in-progress":
      return "bg-purple-50 text-purple-700 border border-purple-200"
    case "awaiting-final-payment":
      return "bg-orange-50 text-orange-700 border border-orange-200"
    case "completed":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200"
    case "cancelled":
      return "bg-red-50 text-red-700 border border-red-200"
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200"
  }
}

const getWorkerResponseColor = (response: string) => {
  switch (response) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200"
    case "rejected":
      return "bg-red-50 text-red-700 border border-red-200"
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-200"
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "text-emerald-600"
    case "unpaid":
      return "text-amber-600"
    case "failed":
      return "text-red-600"
    case "refunded":
      return "text-blue-600"
    default:
      return "text-slate-600"
  }
}

const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="w-4 h-4" />
    case "unpaid":
      return <AlertCircle className="w-4 h-4" />
    case "failed":
      return <AlertCircle className="w-4 h-4" />
    case "refunded":
      return <ZapOff className="w-4 h-4" />
    default:
      return null
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

// -----------------------
// MAIN PAGE
// -----------------------
export function BookingDetailPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchDetail = async () => {
      if (!bookingId) {
        if (!mounted) return
        setError("Missing booking id")
        setBooking(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await userService.bookingDetailData(bookingId)
        console.log("response", response.data)
        if (!response.data.success) {
          ErrorToast(response.data.message || "something went wrong")
          return
        }
        const data = response.data.booking as BookingDetail
        if (!mounted) return
        setBooking(data)
      } catch (err) {
        if (!mounted) return
        console.error("Failed to fetch booking detail:", err)
        ErrorToast("Failed to load booking details.")
        setBooking(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchDetail()

    return () => {
      mounted = false
    }
  }, [bookingId])

  if (error) return <p className="p-6 text-center text-red-500">{error}</p>

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse mb-4" />
          <p className="text-slate-600 font-medium">Loading booking details...</p>
        </div>
      </div>
    )

  if (!booking)
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-semibold">Booking not found!</p>
      </div>
    )

  const currentStatusIndex = statusSteps.indexOf(booking.status)
  const canCancel =
    (booking.status === "pending" || booking.status === "confirmed") && booking.workerResponse !== "rejected"
  const showOTPVerification = booking.status === "in-progress"

  return (<>
    <Header/>
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-18 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Booking Details
              </h1>
              <p className="text-slate-500 mt-2 flex items-center gap-2">
                <span className="text-sm font-mono bg-slate-200 px-3 py-1 rounded-full">{booking.id}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Badge
                variant="outline"
                className={`${getStatusColor(booking.status)} px-4 py-2 text-sm font-semibold w-fit whitespace-nowrap`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace(/-/g, " ")}
              </Badge>
              <Badge
                variant="outline"
                className={`${getWorkerResponseColor(booking.workerResponse)} px-4 py-2 text-sm font-semibold w-fit whitespace-nowrap`}
              >
                {booking.workerResponse.charAt(0).toUpperCase() + booking.workerResponse.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Modern Timeline */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between gap-2">
              {statusSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        index <= currentStatusIndex
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                          : index === currentStatusIndex + 1
                            ? "bg-blue-100 text-blue-600 border-2 border-blue-300"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {index < currentStatusIndex ? <Check size={18} /> : index + 1}
                    </div>
                    <span className="text-xs text-center text-slate-600 font-semibold hidden md:inline">
                      {step.replace(/-/g, " ")}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        index < currentStatusIndex ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </Card>

          {/* OTP Verification Button */}
          {showOTPVerification && (
            <div className="mt-6 animate-in fade-in duration-500">
              <Button
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <QrCode size={18} className="mr-2" />
                Show QR Code Verification
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                <h2 className="text-lg font-bold text-slate-900">Service</h2>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Name</p>
                  <p className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {booking.serviceName}
                  </p>
                </div>
                {booking.description && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{booking.description}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date</p>
                  <div className="flex items-center gap-2 text-slate-900 font-semibold">
                    <Calendar size={16} className="text-blue-500" />
                    {booking.date}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start</p>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-blue-500" />
                      <p className="font-bold text-slate-900">{booking.startTime}</p>
                    </div>
                  </div>
                  {booking.endTime && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">End</p>
                      <p className="font-bold text-slate-900">{booking.endTime}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Worker & Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Worker Card */}
            <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
                <h2 className="text-lg font-bold text-slate-900">Worker</h2>
              </div>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                    <AvatarImage src={booking.workerImage || "/placeholder.svg"} alt={booking.workerName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                      {booking.workerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">{booking.workerName}</p>
                  <p className="text-emerald-600 text-sm font-semibold mt-1">✓ Verified Professional</p>
                  <div className="flex items-center gap-2 mt-4 text-slate-600 bg-slate-100 rounded-lg px-3 py-2 w-fit">
                    <Phone size={16} className="text-blue-500" />
                    <p className="text-sm font-medium">{booking.contact}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Address Card */}
            <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                <h2 className="text-lg font-bold text-slate-900">Location</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <MapPin size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-900 font-medium leading-relaxed">{booking.address}</p>
                </div>
                <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center border border-slate-300 shadow-inner overflow-hidden">
                  <div className="text-center">
                    <MapPin size={40} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-medium">Map Preview</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Price Breakdown */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full" />
            <h2 className="text-2xl font-bold text-slate-900">Price Breakdown</h2>
          </div>
          <div className="space-y-0 divide-y divide-slate-200">
            {/* Advance Amount */}
            <div className="py-4 flex items-center justify-between group hover:bg-slate-50 px-2 rounded-lg transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-600">Advance Payment</p>
                <p
                  className={`text-xs font-medium flex items-center gap-1 mt-1 ${getPaymentStatusColor(booking.advancePaymentStatus)}`}
                >
                  {getPaymentStatusIcon(booking.advancePaymentStatus)}
                  {booking.advancePaymentStatus.charAt(0).toUpperCase() + booking.advancePaymentStatus.slice(1)}
                </p>
              </div>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(booking.advanceAmount)}</p>
            </div>

            {/* Remaining Amount */}
            <div className="py-4 flex items-center justify-between group hover:bg-slate-50 px-2 rounded-lg transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-600">Remaining Payment</p>
                <p
                  className={`text-xs font-medium flex items-center gap-1 mt-1 ${getPaymentStatusColor(booking.finalPaymentStatus)}`}
                >
                  {getPaymentStatusIcon(booking.finalPaymentStatus)}
                  {booking.finalPaymentStatus.charAt(0).toUpperCase() + booking.finalPaymentStatus.slice(1)}
                </p>
              </div>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(booking.remainingAmount)}</p>
            </div>

            {/* Total Amount */}
            <div className="py-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 px-4 rounded-lg">
              <p className="text-lg font-bold text-slate-900">Total Amount</p>
              <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatCurrency(booking.totalAmount)}
              </p>
            </div>

            {/* Payment Method */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-blue-500" />
                <p className="text-sm font-semibold text-slate-600">Payment Method</p>
              </div>
              <Badge className="capitalize bg-slate-200 text-slate-800 font-semibold">{booking.paymentMethod}</Badge>
            </div>
          </div>
        </Card>

        {/* Additional Items */}
        {booking.additionalItems && booking.additionalItems.length > 0 && (
          <Card className="p-8 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
              <h2 className="text-2xl font-bold text-slate-900">Additional Items</h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-900">Item</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-slate-900">Qty</th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-900">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.additionalItems.map((item, index) => (
                    <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-slate-900 font-medium">{item.name}</td>
                      <td className="py-4 px-4 text-center text-slate-900 font-semibold">{item.qty}</td>
                      <td className="py-4 px-4 text-right font-bold text-slate-900">{formatCurrency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {canCancel && (
            <Button
              variant="destructive"
              size="lg"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <Trash2 size={18} className="mr-2" />
              Cancel Booking
            </Button>
          )}
          {!canCancel && (
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <Check size={18} className="mr-2" />
              Booking Confirmed
            </Button>
          )}
        </div>
      </div>
    </main>
    <Footer/>
    </>
  )
}
