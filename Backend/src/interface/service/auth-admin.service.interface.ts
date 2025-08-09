
import { LoginDto } from "../../dto/shared/login.dto";
import { IUser } from "../../interface/model/user.model.interface";
export interface IAuthAdminService {
  login(
    userCredential: LoginDto
  ): Promise<{ accessToken: string; refreshToken: string; admin:{name:string ,email:string} }>;
  
}