"use client"

import React, { useEffect, useState } from "react"
import {
  ArrowLeft,
  User,
  Briefcase,
  Mail,
  Phone,
  DollarSign,
  Award,
  FileText,
  Edit3,
  Eye,
  Download,
  MapPin,
  Image as ImageIcon,
  Loader2,
  KeyRound,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WorkerLayout } from "@/components/worker/Dashboard/WorkerLayout"
import { Navbar } from "@/components/worker/Dashboard/WorkerNavbar"
import { workerService } from "@/api/WorkerService"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { ErrorToast, SuccessToast } from "@/components/shared/Toaster"
import { authService } from "@/api/AuthService"
import { uploadImageCloudinary } from "@/lib/cloudinaryService"
import CropImageModal from "@/components/shared/ImageCropModal."
import { useNavigate } from "react-router-dom"

interface Worker {
  _id: string
  name: string
  email: string
  phone: string
  profileImage?: string
  zone: string
  experience: "0-1" | "2-5" | "6-10" | "10+"
  category: {
    _id: string
    category: string
  }
  fees: number
  isVerified: "pending" | "approved" | "rejected"
  documents?: string
}

const WorkerProfilePage: React.FC = () => {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Worker>>({})
  const [uploading, setUploading] = useState(false)
  const [cropOpen, setCropOpen] = useState(false) 
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const workerEmail = useSelector((state: RootState) => state.workerTokenSlice.worker?.email)
  const navigate=useNavigate()

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        if (!workerEmail) return
        const res = await workerService.getProfileDetails()
        setWorker(res.data.worker)
      } catch (err) {
        console.error("Error fetching worker:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorker()
  }, [workerEmail])

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const handleEditClick = () => {
    setFormData({
      name: worker?.name,
      phone: worker?.phone,
      zone: worker?.zone,
      fees: worker?.fees,
      experience: worker?.experience,
      profileImage: worker?.profileImage,
    })
    setEditOpen(true)
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
    setCropOpen(true) 
  }
  const handleCropComplete = async (croppedFile: File) => {
  setUploading(true);
  try {
    const newImgUrl = await uploadImageCloudinary(croppedFile);
    setFormData((prev) => ({ ...prev, profileImage: newImgUrl }));
    SuccessToast("Profile image cropped & updated!");
  } catch (err) {
    console.error(err);
    ErrorToast("Failed to upload cropped image");
  } finally {
    setUploading(false);
    setCropOpen(false);
    setSelectedImage(null);
  }
};

  const handleSave = async () => {
    try {
      console.log("hellooo",formData)
      const res = await workerService.updateProfileDetails(formData)
      console.log(res)
      SuccessToast("Profile updated successfully")
      setWorker(res.data.worker)
      setEditOpen(false)
    } catch (err) {
      console.error(err)
      ErrorToast("Failed to update profile")
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-gray-600" size={40} />
      </div>
    )

  if (!worker)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Worker data not found.
      </div>
    )

  return (
    <WorkerLayout>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 mb-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="shadow-lg bg-white/80 backdrop-blur-lg border border-gray-200">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  {worker.profileImage ? (
                    <img
                      src={worker.profileImage}
                      alt={worker.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-4 border-white shadow">
                      {getInitials(worker.name)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                    <Edit3 size={18} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">{worker.name}</h1>
                  <p className="text-blue-600 font-semibold">{worker.category?.category}</p>
                  <Badge
                    variant={
                      worker.isVerified === "approved"
                        ? "default"
                        : worker.isVerified === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                    className="mt-1"
                  >
                    {worker.isVerified.toUpperCase()}
                  </Badge>
                </div>

                <Button size="sm" onClick={handleEditClick} className="bg-blue-600 text-white">
                  <Edit3 size={14} className="mr-1" /> Edit
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <h3 className="font-semibold">Personal Information</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Mail size={14} /> Email
                  </span>
                  <span className="font-medium">{worker.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Phone size={14} /> Phone
                  </span>
                  <span className="font-medium">{worker.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <MapPin size={14} /> Zone
                  </span>
                  <span className="font-medium">{worker.zone}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} />
                  <h3 className="font-semibold">Professional Details</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Award size={14} /> Experience
                  </span>
                  <span className="font-medium">{worker.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <DollarSign size={14} /> Fees
                  </span>
                  <span className="font-medium">₹{worker.fees}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <h3 className="font-semibold">Documents</h3>
                </div>
              </CardHeader>
              <CardContent>
                {worker.documents ? (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {worker.documents.split("/").pop()}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(worker.documents!, "_blank")}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => alert("Download not implemented")}
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded</p>
                )}
              </CardContent>
              
            </Card>
            
          </motion.div>
          <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={()=>navigate('/worker/profile/change-password')}
              >
                  <KeyRound className="w-4 h-4" />
                  Change Password
            </Button>

          {/* ✨ Edit Profile Modal */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
              <DialogHeader className="pb-2 border-b border-gray-200">
                <DialogTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Edit Your Profile
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Left Section - Image & Personal */}
                <div className="flex flex-col items-center text-center space-y-3 border-r border-gray-100 pr-4">
                  <div className="relative group">
                    <img
                      src={formData.profileImage || worker?.profileImage || "/placeholder-user.png"}
                      alt="profile"
                      className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                    />
                    <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                      {uploading ? (
                        <Loader2 className="animate-spin text-white" size={20} />
                      ) : (
                        <ImageIcon className="text-white" size={22} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formData.name || worker?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{worker?.email}</p>
                  <Input
                    className="w-3/4 text-center mt-2"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone"
                  />
                </div>

                {/* Right Section - Professional Info */}
                <div className="space-y-4 pl-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Zone</label>
                    <Input
                      value={formData.zone || ""}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="focus:ring-2 focus:ring-blue-400"
                      disabled={true}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Experience
                      </label>
                      <Input
                        value={formData.experience || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, experience: e.target.value as any })
                        }
                        className="focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Fees (₹)
                      </label>
                      <Input
                        type="number"
                        value={formData.fees || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, fees: Number(e.target.value) })
                        }
                        className="focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-gray-200 mt-4 gap-3">
                    <Button variant="outline" onClick={() => setEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5"
                      onClick={handleSave}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} /> Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <CropImageModal
            open={cropOpen}
            onClose={() => setCropOpen(false)}
            onCropComplete={handleCropComplete}
            
          />
        </div>
      </div>
    </WorkerLayout>
  )
}

export default WorkerProfilePage
