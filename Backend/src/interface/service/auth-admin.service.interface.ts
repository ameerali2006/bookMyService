
import { LoginDto } from "../../dto/shared/login.dto";
import { IUser } from "../../model/user.model";
export interface IAuthAdminService {
  login(
    userCredential: LoginDto
  ): Promise<{ accessToken: string; refreshToken: string }>;
  getAllUsers(): Promise<IUser[]>;
}