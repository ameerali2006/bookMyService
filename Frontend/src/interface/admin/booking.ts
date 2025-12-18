export interface AdminBooking {
  id: string
  customerName: string
  workerName: string
  serviceName: string
  date: Date
  startTime: string
  endTime: string
  status: "confirmed" | "in-progress" | "completed" | "cancelled"
  createdAt: Date
}

export type BookingStatus = AdminBooking["status"]
