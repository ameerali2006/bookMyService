"use client"

import React, { useState, useCallback, lazy, Suspense } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Loader2, Navigation } from "lucide-react"
import { ErrorToast, SuccessToast, WarningToast } from "@/components/shared/Toaster"


const MapComponent = lazy(() => import("../../shared/Map"))

interface LocationData {
  lat: number
  lng: number
  address?: string
  city?: string
  pincode?: string
}

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (location: LocationData) => void
  onSkip?: () => void
}

export function LocationModal({ isOpen, onClose, onConfirm, onSkip }: LocationModalProps) {
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 })
  const [location, setLocation] = useState("")
  const [cityName, setCityName] = useState("")
  const [pincode, setPincode] = useState("")
  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
      )
      const data = await response.json()
      if (data && data.address) {
        const address = data.address
        const city = address.city || address.town || address.village || address.suburb || ""
        const postal = address.postcode || ""
        setCityName(city)
        setPincode(postal)
        setLocation(data.display_name || "")
        return { city, postal, address: data.display_name }
      }
    } catch (error) {
      ErrorToast("Reverse geocoding failed.")
    }
    return null
  }, [])

  const handleSearch = useCallback(async () => {
    if (!location.trim()) {
      WarningToast("Please enter a location. Enter a city, area, or pincode to search.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&accept-language=en`,
      )
      const data = await response.json()
      if (data && data.length > 0) {
        const result = data[0]
        const newCoords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) }
        setCoords(newCoords)
        await reverseGeocode(newCoords.lat, newCoords.lng)
        SuccessToast(`Location found: ${result.display_name}`)
      } else {
        ErrorToast("Location not found. Please try a different search term.")
      }
    } catch (error) {
      ErrorToast("Unable to search for location. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [location, reverseGeocode])

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      ErrorToast("Your browser doesn't support geolocation.")
      return
    }

    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newCoords = { lat: position.coords.latitude, lng: position.coords.longitude }
        setCoords(newCoords)
        const geocodeResult = await reverseGeocode(newCoords.lat, newCoords.lng)
        SuccessToast(
          geocodeResult?.city
            ? `Location set to ${geocodeResult.city}${geocodeResult.postal ? `, ${geocodeResult.postal}` : ""}`
            : "Map updated to your current location"
        )
        setGeoLoading(false)
      },
      (error) => {
        let message = "Unable to get your location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable"
            break
          case error.TIMEOUT:
            message = "Location request timed out"
            break
        }
        ErrorToast(message)
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [reverseGeocode])

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setCoords({ lat, lng })
    await reverseGeocode(lat, lng)
  }, [reverseGeocode])

  const handleConfirm = useCallback(() => {
    if (!location.trim()) {
      WarningToast("Please select or search for a location before confirming.")
      return
    }

    if (!cityName.trim()) {
      WarningToast("City name not found. Please choose a valid location.")
      return
    }

    if (!pincode.trim()) {
      WarningToast("Pincode is missing. Please select a complete location.")
      return
    }

    if (!coords.lat || !coords.lng) {
      WarningToast("Coordinates missing. Please select a valid location on the map.")
      return
    }

    onConfirm({
      lat: coords.lat,
      lng: coords.lng,
      address: location,
      city: cityName,
      pincode: pincode,
    })
    SuccessToast("Location confirmed successfully!")
  }, [coords, location, cityName, pincode, onConfirm])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <MapPin className="h-6 w-6 mr-2 inline-block align-middle" />
            Set your location
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-input">Search Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location-input"
                  placeholder="Enter city, area, or pincode..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading} size="icon" variant="outline">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleCurrentLocation}
              disabled={geoLoading}
              variant="outline"
              className="w-full bg-transparent"
            >
              {geoLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Navigation className="h-4 w-4 mr-2" />}
              Use Current Location
            </Button>

            {(cityName || pincode) && (
              <div className="space-y-2">
                <Label>Location Details</Label>
                <div className="text-sm bg-muted p-3 rounded-md space-y-1">
                  {cityName && <div><span className="font-medium">City:</span> {cityName}</div>}
                  {pincode && <div><span className="font-medium">Pincode:</span> {pincode}</div>}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Selected Coordinates</Label>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <div>Latitude: {coords.lat.toFixed(6)}</div>
                <div>Longitude: {coords.lng.toFixed(6)}</div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>• Click on the map to place a marker</p>
              <p>• Search for a location using the input above</p>
              <p>• Use your current location with GPS</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Map</Label>
            <div className="h-80 lg:h-96 rounded-md overflow-hidden border">
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center bg-muted">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
              >
                <MapComponent center={[coords.lat, coords.lng]} onLocationSelect={handleMapClick} />
              </Suspense>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {/* {onSkip && <Button variant="outline" onClick={onSkip}>Skip</Button>} */}
          <Button onClick={handleConfirm}>Confirm Location</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
