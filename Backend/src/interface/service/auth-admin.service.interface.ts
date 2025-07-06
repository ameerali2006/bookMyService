
import { LoginDto } from "../../dto/shared/login.dto";
export interface IAuthAdminService {
  login(
    userCredential: LoginDto
  ): Promise<{ accessToken: string; refreshToken: string }>;
}