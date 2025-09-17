import { AdminDataDTO } from "../../../dto/admin/admin.dto";
import { UserRegisterDTO } from "../../../dto/user/auth/user-register.dto";
import { UserDataDTO } from "../../../dto/user/auth/userData.dto";
import { responseDto, WorkerRegisterDTO } from "../../../dto/worker/auth/worker-register.dto";

export interface  IRegisterService{
    execute(user:WorkerRegisterDTO|UserRegisterDTO):Promise<{ accessToken: string; refreshToken: string,user:UserDataDTO|responseDto}>
}