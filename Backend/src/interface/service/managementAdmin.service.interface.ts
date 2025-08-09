import { userManageDto, workerManageDto } from "../../dto/admin/management.dto";
import { IUser } from "../model/user.model.interface";
import { IWorker } from "../model/worker.model.interface";

export interface IManagementAdminService{


    getAllUsers(role:"worker"|"user"): Promise<userManageDto[]|workerManageDto[]>;
    updateStatus(userId:string,status:boolean,role:"worker"|"user"):Promise<IUser|IWorker|null>
    verifyWorker(userId:string,isVerified:boolean):Promise<IWorker|null>
}