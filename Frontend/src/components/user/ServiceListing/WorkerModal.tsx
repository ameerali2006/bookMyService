"use client"

import { X, Star, MapPin, Clock, Award } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Worker {
  _id:string
  name: string
  experience: string
  fees:number
  image: string
  zone: string
  distance:number

}

interface WorkerProfileModalProps {
  worker: Worker | null
  isOpen: boolean
  onClose: () => void
}

export function WorkerProfileModal({ worker, isOpen, onClose }: WorkerProfileModalProps) {
  if (!worker) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Worker Profile</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={worker.image || "/placeholder.svg"} alt={worker.name} />
              <AvatarFallback className="text-lg">
                {worker.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-balance">{worker.name}</h2>
              {/* <p className="text-lg text-muted-foreground mb-2">{worker.role}</p> */}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{worker.experience} experience</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{worker.zone}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{worker.fees}</div>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {/* <span className="font-medium">{worker.rating}</span>
                <span className="text-muted-foreground">({worker.reviews})</span> */}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Skills & Specialties
            </h3>
            {/* <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div> */}
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            {/* <p className="text-muted-foreground leading-relaxed">
              {worker.name} is a highly experienced {worker.role.toLowerCase()} with {worker.experience} of professional
              experience. Known for quality work and excellent customer service, they have maintained a {worker.rating}
              -star rating across {worker.reviews} completed projects. Specializing in{" "}
              {worker.skills.slice(0, 3).join(", ")}, they bring expertise and reliability to every job.
            </p> */}
          </div>

          {/* Recent Reviews */}
          <div>
            <h3 className="font-semibold mb-3">Recent Reviews</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="font-medium">John D.</span>
                  <span className="text-muted-foreground text-sm">2 days ago</span>
                </div>
                {/* <p className="text-sm text-muted-foreground">
                  "Excellent work! {worker.name} was professional, punctual, and did an outstanding job. Highly
                  recommend for anyone needing {worker.role.toLowerCase()} services."
                </p> */}
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="font-medium">Sarah M.</span>
                  <span className="text-muted-foreground text-sm">1 week ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Great experience working with {worker.name}. Very knowledgeable and completed the work efficiently.
                  Will definitely hire again!"
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">Book Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
