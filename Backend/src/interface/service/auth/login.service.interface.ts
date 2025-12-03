import { AdminDataDTO } from '../../../dto/admin/admin.dto';
import { LoginDto } from '../../../dto/shared/login.dto';
import { UserDataDTO } from '../../../dto/user/auth/userData.dto';
import { responseDto } from '../../../dto/worker/auth/worker-register.dto';
import { IAdmin } from '../../model/admin.model.interface';
import { IUser } from '../../model/user.model.interface';
import { IWorker } from '../../model/worker.model.interface';

export interface ILoginService{
    execute(user:LoginDto):Promise<{success:boolean, message:string, accessToken: string|null; refreshToken: string|null, user:UserDataDTO | responseDto|IAdmin| null}>
}
