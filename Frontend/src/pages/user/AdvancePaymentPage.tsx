"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/user/shared/Header"
import Footer from "@/components/user/shared/Footer"

type Address = {
  id: string
  label: string // e.g., "Home", "Office"
  address: string
  phone: string
}

const mockAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    address: "123 MG Road, 4th Cross, Indiranagar, Bengaluru, Karnataka - 560038",
    phone: "+91 98765 43210",
  },
  {
    id: "addr-2",
    label: "Office",
    address: "9th Floor, Tech Park, Outer Ring Road, Marathahalli, Bengaluru - 560037",
    phone: "+91 99887 76655",
  },
  {
    id: "addr-3",
    label: "Parents",
    address: "22/7 South Street, Anna Nagar, Chennai, Tamil Nadu - 600040",
    phone: "+91 90909 80808",
  },
]

const bookingDetails = {
  workerName: "John Doe",
  serviceName: "AC Repair",
  date: "Mon, 20 Oct 2025",
  time: "10:00 AM – 12:00 PM",
  description: "AC not cooling properly, need gas refill.",
  totalPrice: 500,
  advance: 100,
}

export default function AdvancePaymentPage() {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(mockAddresses[0]?.id ?? "")
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false)

  const selectedAddress = mockAddresses.find((a) => a.id === selectedAddressId)

  const handleConfirmStripe = () => {
    console.log("Stripe checkout initiated")
    console.log("Selected address:", selectedAddress)
    setIsStripeModalOpen(false)
  }

  const handleWalletPay = () => {
    console.log(`Wallet payment initiated for ₹${bookingDetails.advance}`)
    console.log("Selected address:", selectedAddress)
  }

  return (
    <main className="min-h-[100dvh] bg-white">
      {/* Progress indicator */}
      <div className="w-full border-b border-border bg-background">
        <Header/>
      </div>

      <section className="mx-auto max-w-6xl grid grid-cols-1 pt-20 md:grid-cols-2 gap-6 p-6 bg-white">
        {/* Left: Address Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground text-pretty">Select Address</h2>

          <div className="space-y-3">
            <form className="space-y-3" aria-label="Saved addresses">
              {mockAddresses.map((addr) => (
                <label key={addr.id} className="block " >
                  <Card
                    className={cn(
                      "shadow-lg rounded-2xl p-4  border border-border transition-colors cursor-pointer bg-white",
                      selectedAddressId === addr.id
                        ? "ring-2 ring-ring bg-gray-300 "
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        className="mt-1 h-4 w-4 accent-yellow-200"
                        aria-label={`Select ${addr.label} address`}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />          
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-foreground">{addr.label}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.address}</p>
                        <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  </Card>
                </label>
              ))}
            </form>
          </div>

          {/* <div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => console.log("Add New Address clicked")}
              aria-label="Add new address"
            >
              + Add New Address
            </Button>
          </div> */}
        </div>

        {/* Right: Booking Details & Payment */}
        <div className="space-y-6 ">
          {/* Booking Details */}
          <Card className="shadow-lg rounded-2xl p-4  border border-border bg-gray-50">
            <h3 className="text-lg font-semibold text-foreground mb-3">Booking Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <dt className="text-muted-foreground">Worker Name</dt>
                <dd className="text-foreground">{bookingDetails.workerName}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Service Name</dt>
                <dd className="text-foreground">{bookingDetails.serviceName}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="text-foreground">{bookingDetails.date}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground">Time</dt>
                <dd className="text-foreground">{bookingDetails.time}</dd>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <dt className="text-muted-foreground">Description</dt>
                <dd className="text-foreground">{bookingDetails.description}</dd>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between pt-2 border-t border-border">
                <dt className="font-medium text-foreground">Total Price</dt>
                <dd className="font-semibold text-foreground">₹{bookingDetails.totalPrice}</dd>
              </div>
            </dl>
          </Card>

          {/* Bill Summary + Payment */}
          <Card className="shadow-lg rounded-2xl p-4 bg-gray-100 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3">Bill Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-foreground">₹{bookingDetails.totalPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Advance to Pay Now</span>
                <span className="font-semibold text-foreground">₹{bookingDetails.advance}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full hover:bg-gray-300"
                onClick={handleWalletPay}
                aria-label={`Pay ₹${bookingDetails.advance} via Wallet`}
              >
                {"Pay ₹100 via Wallet"}
              </Button>
              <Button
                type="button"
                className="w-full bg-blue-900 hover:bg-blue-800"
                onClick={() => setIsStripeModalOpen(true)}
                aria-label={`Pay ₹${bookingDetails.advance} via Stripe`}
              >
                {"Pay ₹100 via Stripe"}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Stripe Payment Modal */}
      {isStripeModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stripe-modal-title"
          aria-describedby="stripe-modal-desc"
        >
          <Card className="w-full max-w-md shadow-lg rounded-2xl p-6 bg-card border border-border">
            <h4 id="stripe-modal-title" className="text-lg font-semibold text-foreground">
              Stripe Payment
            </h4>
            <p id="stripe-modal-desc" className="mt-2 text-sm text-muted-foreground">
              You will be redirected to the Stripe Checkout page.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button type="button" onClick={handleConfirmStripe} aria-label="Confirm Stripe payment">
                Confirm Payment
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsStripeModalOpen(false)}
                aria-label="Cancel Stripe payment"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
      <Footer/>
    </main>
  )
}
