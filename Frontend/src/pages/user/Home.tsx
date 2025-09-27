import { useState, useEffect } from "react";

import Footer from "@/components/user/shared/Footer";
import Header from "@/components/user/shared/Header";
import { ServiceCategories } from "@/components/user/Dashboard/ServiceCategories";
import { LocationModal } from "@/components/user/Dashboard/LocationModal";
import { useDispatch,useSelector } from "react-redux";
import { updateLocation } from "@/redux/slice/userTokenSlice";
import type { RootState } from "@/redux/store";


export default function Homepage() {
  const location=useSelector((state:RootState)=>state.userTokenSlice.user?.location)
  const user=useSelector((state:RootState)=>state.userTokenSlice.user)
  console.log(location)
  console.log(user)
  const dispatch = useDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Show modal automatically when page loads
  useEffect(() => {
    if(!location){
      setShowLocationModal(true);
    }
  }, []);

  const handleLocationConfirm = (locationData: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    pincode?: string;
  }) => {
    dispatch(updateLocation(locationData));
    setShowLocationModal(false);
  };

  const handleLocationSkip = () => {
    setShowLocationModal(false);
  };

  return (
    <>
      <Header />

      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onConfirm={handleLocationConfirm}
        onSkip={handleLocationSkip}
      />

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
        <ServiceCategories />

        {/* Why bookMyService Section */}
        <section className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why bookMyService ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {[
                { title: "On Demand / Scheduled" },
                { title: "Verified Partners" },
                { title: "Service Warranty" },
                { title: "Transparent Pricing" },
                { title: "Online Payments" },
                { title: "Support" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Mechanic with car illustration"
                  className="w-full max-w-md mx-auto"
                />
              </div>
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

      <Footer />
    </>
  );
}
