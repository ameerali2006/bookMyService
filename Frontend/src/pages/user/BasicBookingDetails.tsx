"use client"

import * as React from "react"
import ChooseDateTime, { type TimeRange } from "@/components/user/ServiceListing/DateTimeSelect"
import { cn } from "@/lib/utils"
import Header from "@/components/user/shared/Header"
import { Label } from "@/components/ui/label"

import { userService } from "@/api/UserService"
import { useParams } from "react-router-dom"


export default function BasicBookingDetails() {
  

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [availableTimes, setAvailableTimes] = React.useState<TimeRange[]>([])
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const [description, setDescription] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [datesData, setDatesData] = React.useState<any[]>([])
  const param =useParams()
  const workerId=param.workerId

  // Fetch availability when component mounts
  React.useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true)
        console.log(workerId)
        const response = await userService.getWorkerAvailability(workerId as string)
        const { success, data } = response.data

        if (success && data?.dates) {
          setDatesData(data.dates)
        
          const todayStr = selectedDate.toISOString().split("T")[0]
          const todayAvailability = data.dates.find((d: any) => d.date === todayStr)
          setAvailableTimes(todayAvailability?.availableTimes || [])
        } else {
          setDatesData([])
          setAvailableTimes([])
        }
      } catch (err) {
        console.error("Error fetching availability:", err)
        setAvailableTimes([])
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [workerId])

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)

    const selectedDateStr = date.toISOString().split("T")[0]
    const found = datesData.find((d: any) => d.date === selectedDateStr)

    if (found?.enabled) {
      setAvailableTimes(found.availableTimes)
    } else {
      setAvailableTimes([])
    }
  }

  const handleTimeSelect = (t: string) => {
    setSelectedTime(t)
  }

  return (
    <>
      <Header />
      <main className={cn("min-h-dvh w-full bg-background text-foreground")}>
        <div className="mx-auto w-full max-w-5xl px-6 py-10 pt-20 pb-36">
          {loading ? (
            <p className="text-center text-gray-500">Loading availability...</p>
          ) : (
            <ChooseDateTime
              availableTimes={availableTimes}
              onTimeSelect={handleTimeSelect}
              onDateChange={handleDateChange}
              initialDate={selectedDate}
            />
          )}

          <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
            <Label htmlFor="details" className="block text-base font-medium">
              Additional details
            </Label>
            <textarea
              id="details"
              placeholder="Enter details here"
              className="mt-2 w-full min-h-40 resize-none rounded-xl bg-white p-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white py-3 shadow-md">
          <button
            className="mx-auto block w-[800px] rounded-2xl bg-yellow-400 px-8 py-4 text-xl font-semibold text-blue-900 shadow-lg hover:bg-yellow-500 transition"
          >
            Proceed
          </button>
        </div>
      </main>
    </>
  )
}
