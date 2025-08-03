import { IUser } from "../../interface/model/user.model.interface";
import { UserRegisterDTO } from "../../dto/user/auth/user-register.dto";
import { IOtp } from "../../interface/model/otp.model.interface";
import { LoginDto } from "../../dto/shared/login.dto";
import { UserDataDTO } from "../../dto/user/auth/userData.dto";
export interface IAuthUserService {
  registerUser(data: UserRegisterDTO): Promise<{ accessToken: string; refreshToken: string; userData:UserDataDTO}>;
  generateOtp(email: string): Promise<IOtp>;
  verifyOtp(otpData: Omit<IOtp, "expireAt">): Promise<void>;
  login(userCredential: LoginDto): Promise<{ accessToken: string; refreshToken: string; userData:UserDataDTO}>;
  googleLogin(googleToken: string): Promise<{ accessToken: string; refreshToken: string;  userData:UserDataDTO}>;
}

