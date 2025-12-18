"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Calendar,
  Clock,
  FileText,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Navigation,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { WorkerLayout } from "@/components/worker/Dashboard/WorkerLayout";
import { Navbar } from "@/components/worker/Dashboard/WorkerNavbar";
import { useParams } from "react-router-dom";
import { workerService } from "@/api/WorkerService";
import { ErrorToast, SuccessToast } from "@/components/shared/Toaster";
import { OtpQrVerification } from "@/components/worker/WorkerService/Varification";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
}

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  location: ILocation;
}

export interface IService {
  _id: string;
  category: string;
  name: string;
  description?: string;
}

export interface IAdditionalItem {
  _id?: string;
  name: string;
  price: number;
}

export interface IPaymentItem {
  title: string;
  rate: number;
  label: string;
  quantity: number;
  total: number;
}

export type BookingStatus = "confirmed" | "in-progress" | "completed";
export type PaymentMethod = "cash" | "card" | "upi" | "wallet";

export interface IBooking {
  _id: string;
  userId: string;
  workerId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  description: string;
  address: IAddress;
  additionalItems?: IAdditionalItem[];
  paymentBreakdown?: IPaymentItem[];
  advanceAmount?: number;
  advancePaymentStatus?: string;
  advancePaymentId?: string;
  finalPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  verification: boolean;
}
export interface IBookingPopulated
  extends Omit<IBooking, "userId" | "serviceId"> {
  userId: IUser;
  serviceId: IService;
}

export default function WorkerBookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const [booking, setBooking] = useState<IBookingPopulated | null>(null);
  const [loading, setLoading] = useState(true);
  const [additionalItems, setAdditionalItems] = useState<IAdditionalItem[]>([]);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);
  const loadBooking = async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      const res = await workerService.getBookingDetails(bookingId);
      console.log(res);

      setBooking(res.data.booking);
      setAdditionalItems(res.data.booking.additionalItems || []);
      setDescription(res.data.booking.description || "");
    } catch (error) {
      ErrorToast("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <WorkerLayout>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </WorkerLayout>
    );
  }

  if (!booking) {
    return (
      <WorkerLayout>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-muted-foreground">Booking not found</p>
        </div>
      </WorkerLayout>
    );
  }
  console.log(
    booking.date.split("T")[0],
    new Date().toISOString().split("T")[0]
  );
  const isToday =
    booking.date.split("T")[0] === new Date().toISOString().split("T")[0];
  const isEditable =
    booking.status === "confirmed" || booking.status === "in-progress";
  const isCompleted = booking.status === "completed";

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "in-progress":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {method}
      </Badge>
    );
  };
  const handleVerify = async (otp: string) => {
    if (!booking?._id) {
      ErrorToast("Booking not found");
      return;
    }

    try {
      const response = await workerService.verifyWorker(booking._id, otp);

      if (!response.data.success) {
        ErrorToast(response.data.message || "Verification failed");
        return;
      }

      SuccessToast("Worker verified successfully");

      loadBooking();
    } catch (error: any) {
      console.error("OTP verification error:", error);
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  };
  const formatAddress = () => {
    const { street, city, state, postalCode, country } = booking.address;
    return `${street}, ${city}, ${state} ${postalCode}, ${country}`;
  };

  const calculateDuration = () => {
    const start = new Date(
      `${booking.date.split("T")[0]}T${booking.startTime}`
    );
    const end = new Date(`${booking.date.split("T")[0]}T${booking.endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffHrs > 0 ? `${diffHrs}h ${diffMins}m` : `${diffMins}m`;
  };

  const openMap = () => {
    const [lng, lat] = booking.address.location.coordinates;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };
  const handleReachedLocation = async () => {
    try {
      const res = await workerService.reachedCustomerLocation(booking._id);
      setBooking(res.data.booking);
    } catch {
      ErrorToast("Failed to verify arrival");
    }
  };
  const handleAddItem = async () => {
    //   if (!newItemName.trim() || !newItemPrice) return
    //   const updated = [
    //     ...additionalItems,
    //     { name: newItemName.trim(), price: Number(newItemPrice) },
    //   ]
    //   try {
    //     await workerBookingService.updateAdditionalItems(booking._id, updated)
    //     setAdditionalItems(updated)
    //     setNewItemName("")
    //     setNewItemPrice("")
    //   } catch {
    //     ErrorToast("Failed to add item")
    //   }
  };

  const handleRemoveItem = async (id: string) => {
    //   const updated = additionalItems.filter(i => i._id !== id)
    //   try {
    //     await workerBookingService.updateAdditionalItems(booking._id, updated)
    //     setAdditionalItems(updated)
    //   } catch {
    //     ErrorToast("Failed to remove item")
    //   }
  };
  const calculateItemsTotal = () => {
    return additionalItems.reduce((sum, item) => sum + item.price, 0);
  };

  const handleDescriptionSave = () => {
    setBooking({ ...booking, description });
    setEditingDescription(false);
    // In real app: API call to persist
  };
  const isInProgress = booking.status === "in-progress"
  return (
    <WorkerLayout>
      <Navbar />

      <div className="min-h-screen bg-muted/30">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono font-semibold text-lg">
                    {booking._id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isToday && (
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                  >
                    Today
                  </Badge>
                )}
                <Badge className={cn("border", getStatusColor(booking.status))}>
                  {booking.status.replace("-", " ").toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <div className="grid gap-6">
            {/* Customer Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={booking.userId.image || "/placeholder.svg"}
                        alt={booking.userId.name}
                      />
                      <AvatarFallback className="text-lg">
                        {booking.userId.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.userId.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4" />
                        {booking.userId.phone}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{formatAddress()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={openMap}
                      className="rounded-full"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={isToday ? handleReachedLocation : openMap}
                      disabled={isToday && isInProgress}
                      className="gap-2"
                    >
                      <Navigation className="h-4 w-4" />

                      {isToday
                        ? !isInProgress
                          ? "Reached to Customer Location"
                          : "Worek started"
                        : "Go to Customer Location"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {booking.verification && (
              <OtpQrVerification
                bookingId={booking._id}
                onVerified={(otp) => {
                  handleVerify(otp);
                }}
              />
            )}

            {/* Service Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.serviceId.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Category: {booking.serviceId.category}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Booking Date
                      </p>
                      <p className="font-medium">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Time & Duration
                      </p>
                      <p className="font-medium">
                        {booking.startTime} – {booking.endTime} (
                        {calculateDuration()})
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Status Timeline */}
                <div>
                  <p className="text-sm font-medium mb-4">Status Timeline</p>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                    {["confirmed", "in-progress", "completed"].map(
                      (status, index) => {
                        const isActive =
                          status === booking.status ||
                          (booking.status === "in-progress" &&
                            status === "confirmed") ||
                          (booking.status === "completed" &&
                            status !== "completed");
                        return (
                          <div
                            key={status}
                            className="flex flex-col items-center gap-2 relative z-10"
                          >
                            <div
                              className={cn(
                                "rounded-full p-2 border-2 bg-background",
                                isActive ? "border-primary" : "border-muted"
                              )}
                            >
                              {isActive ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-xs capitalize",
                                isActive
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {status.replace("-", " ")}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Worker Notes / Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Booking Description
                  </span>
                  {isEditable && !editingDescription && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingDescription(true)}
                    >
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingDescription ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full min-h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter booking description..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleDescriptionSave}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDescription(booking.description);
                          setEditingDescription(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">
                    {booking.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary (Worker View) */}
            {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${booking.totalAmount.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Remaining Amount</p>
                  <p className="text-2xl font-bold text-amber-600">${booking.remainingAmount.toFixed(2)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                {getPaymentMethodBadge(booking.paymentMethod)}
              </div>
            </CardContent>
          </Card> */}

            {/* Additional Items Section */}
            {(isEditable || additionalItems.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Additional Items
                    </span>
                    {additionalItems.length > 0 && (
                      <Badge variant="secondary">
                        {additionalItems.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {additionalItems.length > 0 ? (
                    <div className="space-y-2">
                      {additionalItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                          {isEditable && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item._id!)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Separator />
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <p className="font-semibold">Items Total</p>
                        <p className="font-bold text-lg">
                          ₹{calculateItemsTotal().toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No additional items added yet
                    </p>
                  )}

                  {isEditable && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Add New Item</p>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="item-name">Item Name</Label>
                            <Input
                              id="item-name"
                              placeholder="e.g., Replacement Parts"
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item-price">Price (₹)</Label>
                            <Input
                              id="item-price"
                              type="number"
                              placeholder="0.00"
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleAddItem}
                          className="w-full sm:w-auto gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Breakdown (Optional Display) */}
            {/* {booking.paymentBreakdown && booking.paymentBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <button onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)} className="w-full">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Payment Breakdown
                    </span>
                    {isBreakdownExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardTitle>
                </button>
              </CardHeader>
              {isBreakdownExpanded && (
                <CardContent>
                  <div className="space-y-3">
                    {booking.paymentBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.rate.toFixed(2)} {item.label} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">${item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )} */}
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}
