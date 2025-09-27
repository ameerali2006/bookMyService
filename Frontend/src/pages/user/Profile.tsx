"use client"

import { AddressesSection } from "@/components/user/Profile/AddressSection"
import { ProfileSection } from "@/components/user/Profile/ProfileSection"
import { ProfileSidebar } from "@/components/user/Profile/ProfileSideBar"
import { ReviewsSection } from "@/components/user/Profile/ReviewSection"
import { ServicesSection } from "@/components/user/Profile/ServiceSection"
import Header from "@/components/user/shared/Header"
import { useState } from "react"


type Section = "profile" | "services-taken" | "booked-services" | "reviews" | "addresses"

export function ProfilePage() {
  const [activeSection, setActiveSection] = useState<Section>("profile")

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "services-taken":
        return <ServicesSection type="taken" />
      case "booked-services":
        return <ServicesSection type="booked" />
      case "reviews":
        return <ReviewsSection />
      case "addresses":
        return <AddressesSection />
      default:
        return <ProfileSection />
    }
  }

  return (
    <>
    <Header />
    
    <div className="min-h-screen bg-background pt-15">
        
      <div className="flex">
        
        <ProfileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
    </>
  )
}
