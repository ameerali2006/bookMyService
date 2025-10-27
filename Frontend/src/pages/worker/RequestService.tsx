"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock } from "lucide-react";
import RequestDetailsModal from "@/components/worker/RequestService/DetailsModal";
import { Navbar } from "@/components/worker/Dashboard/WorkerNavbar";
import { WorkerLayout } from "@/components/worker/Dashboard/WorkerLayout";

interface ServiceRequest {
  id: string;
  serviceName: string;
  userName: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  userLocation: { lat: number; lng: number };
  notes: string;
  phone: string;
}

const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: "1",
    serviceName: "Plumbing Repair",
    userName: "John Smith",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "123 Main St, Springfield",
    status: "pending",
    userLocation: { lat: 40.7128, lng: -74.006 },
    notes: "Leaking kitchen sink, needs urgent attention",
    phone: "555-0101",
  },
  {
    id: "2",
    serviceName: "Electrical Work",
    userName: "Sarah Johnson",
    date: "2024-01-15",
    time: "2:00 PM",
    location: "456 Oak Ave, Springfield",
    status: "pending",
    userLocation: { lat: 40.758, lng: -73.9855 },
    notes: "Install new light fixtures in bedroom",
    phone: "555-0102",
  },
  {
    id: "3",
    serviceName: "HVAC Maintenance",
    userName: "Mike Davis",
    date: "2024-01-14",
    time: "3:30 PM",
    location: "789 Pine Rd, Springfield",
    status: "approved",
    userLocation: { lat: 40.7489, lng: -73.968 },
    notes: "Annual AC unit maintenance",
    phone: "555-0103",
  },
  {
    id: "4",
    serviceName: "Carpentry",
    userName: "Emily Wilson",
    date: "2024-01-16",
    time: "9:00 AM",
    location: "321 Elm St, Springfield",
    status: "rejected",
    userLocation: { lat: 40.7614, lng: -73.9776 },
    notes: "Build custom shelving unit",
    phone: "555-0104",
  },
];

export default function WorkerRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = requests.filter(
    (req) =>
      req.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <WorkerLayout>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Service Requests
            </h1>
            <p className="text-muted-foreground">
              Manage all service requests assigned to you
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by service, customer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {request.serviceName}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {request.userName}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${getStatusColor(request.status)} border`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {request.date}
                    </span>
                    <span className="text-foreground font-medium">
                      {request.time}
                    </span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium truncate">
                      {request.location}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(request);
                    }}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No requests found matching your search.
              </p>
            </div>
          )}
        </div>

        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </WorkerLayout>
  );
}
