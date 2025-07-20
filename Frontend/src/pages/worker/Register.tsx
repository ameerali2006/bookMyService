"use client"

import type React from "react"

import { useState } from "react"
import {
  Eye,
  EyeOff,
  Upload,
  MapPin,
  Check,
  User,
  Briefcase,
  MapIcon,
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Car,
  Utensils,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const workCategories = [
  { value: "plumber", label: "Plumber", icon: Droplets, color: "text-blue-500" },
  { value: "electrician", label: "Electrician", icon: Zap, color: "text-yellow-500" },
  { value: "carpenter", label: "Carpenter", icon: Hammer, color: "text-amber-600" },
  { value: "mechanic", label: "Mechanic", icon: Wrench, color: "text-gray-600" },
  { value: "driver", label: "Driver", icon: Car, color: "text-green-500" },
  { value: "chef", label: "Chef", icon: Utensils, color: "text-red-500" },
]

export default function WorkerRegistration() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    category: "",
    experience: "",
    documents: null as File | null,
    latitude: "40.7128",
    longitude: "-74.0060",
    zone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-red-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = (strength: number) => {
    if (strength < 50) return "Weak"
    if (strength < 75) return "Medium"
    return "Strong"
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, documents: file }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
      if (!formData.password) newErrors.password = "Password is required"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    if (step === 2) {
      if (!formData.category) newErrors.category = "Work category is required"
      if (!formData.experience) newErrors.experience = "Experience is required"
    }

    if (step === 3) {
      if (!formData.zone) newErrors.zone = "Zone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log("Form submitted:", formData)
      // Handle form submission
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`rounded-xl ${errors.firstName ? "border-red-500" : ""}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`rounded-xl ${errors.lastName ? "border-red-500" : ""}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`rounded-xl ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`rounded-xl ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`rounded-xl pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getStrengthColor(passwordStrength)}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{getStrengthText(passwordStrength)}</span>
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`rounded-xl pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Work Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className={`rounded-xl ${errors.category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your work category" />
                </SelectTrigger>
                <SelectContent>
                  {workCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${category.color}`} />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                <SelectTrigger className={`rounded-xl ${errors.experience ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
            </div>

            <div className="space-y-2">
              <Label>Upload Documents</Label>
              <Card className="border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Drag and drop your documents here, or{" "}
                        <label
                          htmlFor="file-upload"
                          className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium"
                        >
                          click to browse
                        </label>
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </div>
                  {formData.documents && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">{formData.documents.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 3:
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
                placeholder="Enter your service zone (e.g., Downtown, North Side)"
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
                // Simulate getting current location
                setFormData((prev) => ({
                  ...prev,
                  latitude: (40.7128 + Math.random() * 0.01).toFixed(6),
                  longitude: (-74.006 + Math.random() * 0.01).toFixed(6),
                }))
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get Current Location
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return User
      case 2:
        return Briefcase
      case 3:
        return MapIcon
      default:
        return User
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Left side - Image (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <img
          src="https://res.cloudinary.com/dp1sx1dx2/image/upload/v1750684879/login-workers-img_jaf3eo.webp"
          alt="Professional technicians"
          className="w-2/3 h-auto object-cover"
        />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Join Our Professional Network</h2>
          <p className="text-lg opacity-90">Connect with customers and grow your business</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Worker Registration</h1>
              <p className="text-gray-600">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={progress} className="h-2 rounded-full" />
              <div className="flex justify-between mt-4">
                {[1, 2, 3].map((step) => {
                  const StepIcon = getStepIcon(step)
                  return (
                    <div
                      key={step}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        step <= currentStep
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="space-y-4">
              {currentStep < totalSteps ? (
                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl bg-transparent">
                      Previous
                    </Button>
                  )}
                  <Button onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl">
                    Next Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl bg-transparent">
                      Previous
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl">
                      Complete Registration
                    </Button>
                  </div>
                </div>
              )}

              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
