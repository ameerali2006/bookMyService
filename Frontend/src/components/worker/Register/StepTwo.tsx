"use client"

import type { StepProps } from "@/interface/worker/Register.types"
import {
  Zap,
  Wrench,
  Hammer,
  Car,
  Droplets,
  Utensils,
  Upload,
  Check,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const workCategories = [
  { value: "plumber", label: "Plumber", icon: Droplets, color: "text-blue-500" },
  { value: "electrician", label: "Electrician", icon: Zap, color: "text-yellow-500" },
  { value: "carpenter", label: "Carpenter", icon: Hammer, color: "text-amber-600" },
  { value: "mechanic", label: "Mechanic", icon: Wrench, color: "text-gray-600" },
  { value: "driver", label: "Driver", icon: Car, color: "text-green-500" },
  { value: "chef", label: "Chef", icon: Utensils, color: "text-red-500" },
]

export const StepTwo: React.FC<StepProps> = ({ formData, errors, handleInputChange, handleFileUpload }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Work Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
          <SelectTrigger className={`rounded-xl ${errors.category ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select your work category" />
          </SelectTrigger>
          <SelectContent>
            {workCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                    <span>{cat.label}</span>
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
                  <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
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
}
