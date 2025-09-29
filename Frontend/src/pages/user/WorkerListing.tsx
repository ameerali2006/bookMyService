"use client"

import { useEffect, useState } from "react"
import { Search, Star, Filter, ChevronDown } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/ui/Pagination"
import { WorkerProfileModal } from "@/components/worker/ServiceListing/WorkerModal"
import Header from "@/components/user/shared/Header"
import { useParams } from "react-router-dom"
import { userService } from "@/api/UserService"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

type Worker = {
  id: string | number
  name: string
//   role: string
  experience: string
//   rating: number
//   reviews: number
  image: string
  price: string
  location: string
 
}

type SortOption = "rating" | "experience" | "price"

export default function WorkerListingPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("rating")
    const [currentPage, setCurrentPage] = useState(1)
    const [workers, setWorkers] = useState<Worker[]>([])
    const [totalWorkers, setTotalWorkers] = useState(0)
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const workersPerPage = 6
    const [loading, setLoading] = useState(false)
    const param=useParams()
    const location=useSelector((state:RootState)=>state.userTokenSlice.user?.location)
        
    // Fetch workers from backend
    const fetchWorkers = async () => {
        setLoading(true)
        try {
            
             
            const serviceId = param.Id
            
            if (!location?.lat || !location?.lng) {
                console.warn("User location not available")
                setWorkers([])
                setTotalWorkers(0)
                return
            }
            

            const response = await userService.getWorkersNearBy(
                searchTerm,
                sortBy,
                currentPage,
                workersPerPage,
                serviceId as string,
                location?.lat,
                location.lng
            )
            console.log(response)
            // if (data?.success) {
            // setWorkers(data.workers)
            // setTotalWorkers(data.totalCount)
            // } else {
            // setWorkers([])
            // setTotalWorkers(0)
            // }

        } catch (err) {
            console.error("Error fetching workers:", err)
            setWorkers([])
            setTotalWorkers(0)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWorkers()
    }, [searchTerm, sortBy, currentPage])

    const handleWorkerClick = (worker: Worker) => {
        setSelectedWorker(worker)
        setIsModalOpen(true)
    }

    return (
        <div className="min-h-screen">
        <Header />

        <div className="container mx-auto px-4 py-8 pt-20">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                placeholder="Search workers by name, role, or skills..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // reset page when search changes
                }}
                className="pl-10"
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[140px] bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort by {sortBy}
                    <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>Highest Rating</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("experience")}>Most Experience</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price")}>Lowest Price</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>

            {/* Results Count */}
            <div className="mb-6">
            {loading ? (
                <p className="text-muted-foreground">Loading workers...</p>
            ) : (
                <p className="text-muted-foreground">
                Showing {workers.length} of {totalWorkers} workers
                </p>
            )}
            </div>

            {/* Worker Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {workers.map((worker) => (
                <Card
                key={worker.id}
                className="hover:shadow-lg transition-shadow shadow-amber-500 duration-200 cursor-pointer group bg-white "
                onClick={() => handleWorkerClick(worker)}
                >
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={worker.image || "/placeholder.svg"} alt={worker.name} />
                        <AvatarFallback>
                        {worker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{worker.name}</h3>
                        {/* <p className="text-muted-foreground text-sm mb-1">{worker.role}</p> */}
                        <p className="text-muted-foreground text-sm mb-2">{worker.experience} experience</p>

                        <div className="flex items-center space-x-1 mb-2">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        {/* <span className="font-medium">{worker.rating}</span>
                        <span className="text-muted-foreground text-sm">({worker.reviews} reviews)</span> */}
                        </div>

                        <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">{worker.price}</span>
                        <span className="text-muted-foreground text-sm">{worker.location}</span>
                        </div>
                    </div>
                    </div>
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-0">
                    <div className="flex space-x-2 w-full">
                    <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={(e) => {
                        e.stopPropagation()
                        handleWorkerClick(worker)
                        }}
                    >
                        View Profile
                    </Button>
                    <Button
                        className="flex-1 bg-accent hover:bg-blue-800 text-accent-foreground"
                        onClick={(e) => {
                        e.stopPropagation()
                        // Handle booking logic here
                        }}
                    >
                        Book Now
                    </Button>
                    </div>
                </CardFooter>
                </Card>
            ))}
            </div>

            {/* Empty State */}
            {!loading && workers.length === 0 && (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">No workers found</p>
                <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
            </div>
            )}

            {/* Pagination */}
            {!loading && totalWorkers > workersPerPage && (
            <Pagination
                current={currentPage}
                total={totalWorkers}
                pageSize={workersPerPage}
                onChange={(page) => setCurrentPage(page)}
            />
            )}
        </div>

        {/* Worker Profile Modal */}
        <WorkerProfileModal worker={selectedWorker} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
