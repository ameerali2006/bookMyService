import adminAxios from "@/config/axiosSevice/AdminAxios";

export const adminManagement = {
  getAllUsers: async (
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ) => {
    return await adminAxios.get("/users", {
      params: { page, limit, search, sortBy, sortOrder },
    });
  },
  updateUserStatus: async (userId: string, isActive: boolean) => {
    return await adminAxios.patch(`/users/${userId}/status`, { isActive });
  },
  getAllWorkers: async (
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    search?: string
  ) => {
    return await adminAxios.get("/workers", {
      params: { page, limit, sortBy, sortOrder, search },
    });
  },
  updateWorkerStatus: async (workerId: string, isActive: boolean) => {
    return await adminAxios.patch(`/workers/${workerId}/status`, { isActive });
  },
  getUnverifiedWorkers: async (page: number, pageSize: number) => {
    return await adminAxios.get("/workers/unverified", {
      params: { page, pageSize },
    });
  },
  verifyWorker: async (workerId: string, status: "approved" | "rejected") => {
    return await adminAxios.patch(`/workers/${workerId}/unverified`, {
      status,
    });
  },
  getAllSerivces: async (
    search: string,
    sort: string,
    page: number,
    limit: number
  ) => {
    return await adminAxios.get("/services", {
      params: { search, sort, page, limit },
    });
  },
  getCloudinarySignature: async () => {
    return await adminAxios.get("/cloudinary-signature");
  },
  createService: async (data: {
    category: string;
    description: string;
    price: number;
    priceUnit: "per job" | "per hour" | "per item";
    duration: number;
    image: string;
  }) => {
    return await adminAxios.post("/services/create", data);
  },
  updateServiceStatus: async (id: string, status: "active" | "inactive") => {
    return await adminAxios.patch(`/services/${id}/status`, { status });
  },
  getBookings: async (params: {
    search?: string;
    status?: "confirmed" | "in-progress" | "completed" | "cancelled";
    page?: number;
    limit?: number;
  }) => {
    

    return await adminAxios.get("/bookings", {
      params,
    });
  },
};
