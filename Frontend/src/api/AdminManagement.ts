import adminAxios from "@/config/axiosSevice/AdminAxios";

export const  adminManagement= {

    getAllUsers: async (page: number, limit: number, search?: string, sortBy?: string, sortOrder?: "asc" | "desc") => {
        return await adminAxios.get("/users",{params:{ page, limit, search, sortBy, sortOrder }});
    },
    updateUserStatus:async ( userId: string,isActive: boolean ) => {
        return await adminAxios.patch( `/users/${userId}/status`,{isActive} );
    },
    getAllWorkers:async (page: number, limit: number, sortBy?: string, sortOrder?: "asc" | "desc",search?: string,) =>{
        return await adminAxios.get("/workers",{params:{page, limit, sortBy, sortOrder,search}});
    },
    updateWorkerStatus:async ( workerId: string,isActive: boolean )=>{
        return await adminAxios.patch(`/workers/${workerId}/status`,{isActive} )
    }



}