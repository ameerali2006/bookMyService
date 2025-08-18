import { userManageDto, workerManageDto } from "../../dto/admin/management.dto";
import { IUser } from "../model/user.model.interface";
import { IWorker } from "../model/worker.model.interface";

export interface IManagementAdminService{


    getAllUsers(role:"worker"|"user",page:number,limit:number,search:string,sortBy:string,sortOrder:string): Promise<{users:userManageDto[]|workerManageDto[];currentPage: number;totalPages: number;totalItems: number}>;
    updateStatus(userId:string,status:boolean,role:"worker"|"user"):Promise<IUser|IWorker|null>
    verifyWorker(userId:string,status:"approved"|"rejected"):Promise<{status:"approved"|"rejected"}>
    getUnverifiedWorkers(page:number,pageSize:number,status:string):Promise<{workers:IWorker[]|null,total:number,currentPage:number,totalPages:number}>
}