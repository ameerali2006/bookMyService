import { IUser } from "../../model/user.model";
import { UserRegisterDTO } from "../../dto/user/auth/user-register.dto";
import { IOtp } from "../../model/otp.model";
import { LoginDto } from "../../dto/shared/login.dto";

export interface IAuthUserService {
  registerUser(data: UserRegisterDTO): Promise<IUser>;
  generateOtp(email: string): Promise<IOtp>;
  verifyOtp(otpData: Omit<IOtp, "expireAt">): Promise<void>;
  login(userCredential: LoginDto): Promise<{ accessToken: string; refreshToken: string }>;
  googleLogin(googleToken: string): Promise<{ accessToken: string; refreshToken: string }>;
}

