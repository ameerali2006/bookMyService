"use client"

import type { StepProps } from "@/interface/worker/Register.types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapIcon, MapPin } from "lucide-react"

export const StepThree: React.FC<StepProps> = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" value={formData.latitude} readOnly className="rounded-xl bg-gray-50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" value={formData.longitude} readOnly className="rounded-xl bg-gray-50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zone">Service Zone</Label>
        <Input
          id="zone"
          placeholder="Enter your service zone (e.g., Downtown)"
          value={formData.zone}
          onChange={(e) => handleInputChange("zone", e.target.value)}
          className={`rounded-xl ${errors.zone ? "border-red-500" : ""}`}
        />
        {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Current Location</span>
          </div>
          <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Map preview will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
        onClick={() => {
          // Simulated current location logic – could replace with real geolocation API
          const lat = (40.7128 + Math.random() * 0.01).toFixed(6)
          const lng = (-74.006 + Math.random() * 0.01).toFixed(6)
          handleInputChange("latitude", lat)
          handleInputChange("longitude", lng)
        }}
      >
        <MapPin className="w-4 h-4 mr-2" />
        Get Current Location
      </Button>
    </div>
  )
}
