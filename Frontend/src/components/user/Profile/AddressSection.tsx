"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Edit3, Plus, Home, Building } from "lucide-react"

const mockAddresses = [
  {
    id: 1,
    label: "Home",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: true,
    icon: Home,
  },
  {
    id: 2,
    label: "Office",
    address: "456 Business Ave, Suite 200",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    isDefault: false,
    icon: Building,
  },
]

export function AddressesSection() {
  const [addresses] = useState(mockAddresses)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Addresses</h1>
          <p className="text-muted-foreground">Manage your saved addresses for service bookings.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => {
          const IconComponent = address.icon
          return (
            <Card key={address.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{address.label}</CardTitle>
                </div>
                {address.isDefault && <Badge variant="secondary">Default</Badge>}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-foreground font-medium">{address.address}</p>
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm">
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
