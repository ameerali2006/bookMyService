import Footer from "@/components/user/shared/Footer"
import Header from "@/components/user/shared/Header"
import { Search, User, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import {ServiceCategories} from "@/components/user/Dashboard/ServiceCategories"
export default function Homepage() {
  return (
    <>
    <Header/>
    
    <div className="min-h-screen bg-white">
      <br />
      

      {/* Most Used Service Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Most Used Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "CLEANING SERVICE", image: "/placeholder.svg?height=200&width=300" },
              { title: "BEAUTY SERVICE", image: "/placeholder.svg?height=200&width=300" },
              { title: "APPLIANCE REPAIRS", image: "/placeholder.svg?height=200&width=300" },
              { title: "LAUNDRY SERVICES", image: "/placeholder.svg?height=200&width=300" },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-center">{service.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
            

      {/* Service Categories Section */}
      <ServiceCategories/>
      {/* <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              "ELECTRICIAN",
              "PLUMBER",
              "AC SERVICE",
              "PEST CONTROL",
              "CARPENTER",
              "APPLIANCES",
              "FITNESS TRAINER",
              "COOKING/BAKING",
              "BATHROOM CLEANING",
              "HOME DECORATION",
              "YOGA TRAINER",
              "WALL PAINTING",
              "MORE SERVICES",
            ].map((service, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                </div>
                <span className="text-xs text-center font-medium text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why bookMyService Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why bookMyService ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {[
              { title: "On Demand / Scheduled", subtitle: "" },
              { title: "Verified Partners", subtitle: "" },
              { title: "Service Warranty", subtitle: "" },
              { title: "Transparent Pricing", subtitle: "" },
              { title: "Online Payments", subtitle: "" },
              { title: "Support", subtitle: "" },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Placeholder for feature icons */}
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                {feature.subtitle && <p className="text-xs text-gray-600 mt-1">{feature.subtitle}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left side - Illustration */}
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Mechanic with car illustration"
                className="w-full max-w-md mx-auto"
              />
            </div>

            {/* Right side - CTA */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Find your nearest
                <br />
                Mechanic
              </h2>
              <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-md font-bold text-lg hover:bg-yellow-300 transition-colors">
                Find Now
              </button>
            </div>
          </div>
        </div>
      </section>

      
    </div>
    <Footer/>
    </>
  )
}
