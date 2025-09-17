import { AdminDataDTO } from "../../../dto/admin/admin.dto";
import { LoginDto } from "../../../dto/shared/login.dto";
import { UserDataDTO } from "../../../dto/user/auth/userData.dto";
import { responseDto } from "../../../dto/worker/auth/worker-register.dto";


export interface ILoginService{
    execute(user:LoginDto):Promise<{success:boolean,message:string, accessToken: string|null; refreshToken: string|null,user:AdminDataDTO|UserDataDTO|responseDto|null}>
} 