"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit3, Save, X } from "lucide-react"
import { userService } from "@/api/UserService"
import { ErrorToast } from "@/components/shared/Toaster"

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<{name:string,email:string,phone?:string,image?:string}>({
    name: "",
    email: "",
    phone: "",
    image:""
  })
  useEffect(()=>{
    fetchUserData()
  },[])

  const fetchUserData=async ()=>{
    try {
        const response=await userService.getUserDetails()
        if(!response.data.success){
            ErrorToast(response.data.message||"Data invalid")
        }
        console.log(response)
        if (response?.data?.user) {
        setFormData(response.data.user)
        } else {
        ErrorToast("User data not found")
        }
    } catch (error) {
        ErrorToast('Invalid Profile,Try again')
        console.error(error)

    }
  }

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data if needed
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account settings.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData?.image||"https://i.pinimg.com/736x/e5/9e/51/e59e51dcbba47985a013544769015f25.jpg"} />
              <AvatarFallback className="text-lg">{formData?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">Upload a new profile picture to personalize your account.</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Change Photo
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p className="text-foreground font-medium">{formData.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={true}
                />
              ) : (
                <p className="text-foreground font-medium">{formData.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  placeholder={formData.phone?"":"Add your Phone"}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="text-foreground font-medium">{formData.phone||"Add your Phone..."}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
