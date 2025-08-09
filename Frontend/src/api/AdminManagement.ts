import adminAxios from "@/config/axiosSevice/AdminAxios";

export const  adminManagement= {

    getAllUsers: async () => {
        return await adminAxios.get("/users");
    },
    updateUserStatus:async ( userId: string,isActive: boolean ) => {
        return await adminAxios.patch( `/users/${userId}/status`,{isActive} );
    },
    getAllWorkers:async () =>{
        return await adminAxios.get("/workers");
    },
    updateWorkerStatus:async ( workerId: string,isActive: boolean )=>{
        return await adminAxios.patch(`/workers/${workerId}/status`,{isActive} )
    }



}