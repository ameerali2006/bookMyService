import { injectable,inject} from "tsyringe";
import { IAuthUserService } from "../../interface/service/auth-user.service.interface";
import { UserRegisterDTO } from "../../dto/user/auth/user-register.dto";
import { UserDataDTO } from "../../dto/user/auth/userData.dto";
import {TYPES} from '../../config/constants/types'
import {MESSAGES} from '../../config/constants/message'
import {STATUS_CODES} from '../../config/constants/status-code'
import { IUserRepository } from "../../interface/repository/user.repository.interface";
import { CustomError } from "../../utils/custom-error";
import { IPasswordService } from "../../interface/helpers/password-hash.interface";
import { IUser } from "../../model/user.model";
import { IOtp } from "../../model/otp.model";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";
import { IOtpRepository } from "../../interface/repository/otp.repository.interface";
import { LoginDto } from "../../dto/shared/login.dto";
import { IJwtService } from "../../interface/helpers/jwt-service.service.interface";
import { OAuth2Client } from "google-auth-library";
import {UserMapper} from "../../utils/mapper/user-mapper"
import { ENV } from "../../config/env/env";

@injectable()
export class AuthUserService implements IAuthUserService {

    constructor(
        @inject(TYPES.AuthUserRepository) private _authUserRepo:IUserRepository,
        @inject(TYPES.PasswordService) private _passwordHash:IPasswordService,
        @inject(TYPES.EmailService) private _emailService:IEmailService,
        @inject(TYPES.OtpRepository) private _otpRepo:IOtpRepository,
        @inject(TYPES.JwtService) private _jwtService:IJwtService,


    ){}
    async registerUser(userData: UserRegisterDTO): Promise<IUser> {
        try {
            console.log(userData)
            const existingUser=await this._authUserRepo.findByEmail(userData.email)
            if(existingUser){
                throw new CustomError(MESSAGES.ALREADY_EXISTS,STATUS_CODES.CONFLICT)
            }
            if (!userData.password) {
                throw new CustomError(MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED);
            }
            userData.password=await this._passwordHash.hashPassword(userData.password)
            return await this._authUserRepo.create(userData)

        } catch (error) {
             throw error instanceof CustomError
            ? error
            : new CustomError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
            
        }

    
    }
    async generateOtp(email: string): Promise<IOtp> {
        const otp: number = Math.floor(1000 + Math.random() * 9000);
        const expireAt: Date = new Date(Date.now() + 2 * 60 * 1000);
        console.log("otp",otp)
        const otpdata: Partial<IOtp> = {
        email,
        otp: String(otp),
        expireAt,
        };
        const content: string = this._emailService.generateOtpEmailContent(otp);
        const subject: string = "OTP Verification";
        console.log('otp anooo')

        await this._emailService.sendEmail(email, subject, content);
        console.log('sathanamm')
        return await this._otpRepo.create(otpdata);
        
    }
    async verifyOtp(otpData: Omit<IOtp, "expireAt">): Promise<void> {
        try {
            const data: IOtp | null = await this._otpRepo.findOtp(otpData.email);

            if (!data) {
                throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
            }
            const currentTime = new Date();
            const otpExpiryTime = new Date(data.expireAt);

            const user: IUser | null = await this._authUserRepo.findByEmail( otpData.email);
            if (user) {
                throw new CustomError("Email already exists", STATUS_CODES.CONFLICT);
            }
            if (data.otp !== String(otpData.otp)) {
                throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
            }
            if (currentTime > otpExpiryTime) {
                throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
            }
        } catch (error) {
            console.error('verify otp :',error)
            throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.BAD_REQUEST);
            
        }
        
    }
    async login(userCredential: LoginDto): Promise<{ accessToken: string; refreshToken: string;userData:UserDataDTO}> {
        try {
            const userData: IUser | null = await this._authUserRepo.findByEmail(userCredential.email);

            if (!userData) {
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
                );
            }
            if (!userData.password) {
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
                );
            }

            const isPasswordValid: boolean =
            await this._passwordHash.comparePassword(
                userCredential.password,
                userData.password
            );
            if (!isPasswordValid) {
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
                );
            }

            const accessToken = this._jwtService.generateAccessToken(userData._id,"user");
            const refreshToken = this._jwtService.generateRefreshToken(userData._id,"user");

            return { accessToken, refreshToken,userData };
        } catch (error) {
            console.error("Login error:", error);

            
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(
                MESSAGES.UNAUTHORIZED_ACCESS,
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
            
        }
    }
    async googleLogin(googleToken: string): Promise<{ accessToken: string; refreshToken: string; userData:UserDataDTO}> {
        try {
            console.log(ENV.GOOGLE_CLIENT_ID)
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: ENV.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email || !payload.name) {
                console.log(payload)
                throw new CustomError("Invalid Google Token", 400);
            }
            const { email, name ,sub} = payload;

            let user: IUser | null = await this._authUserRepo.findByEmail(email);

            if (!user) {
            const UserData: UserRegisterDTO = {
                email: email,
                name: name,
                googleId:sub,
            };
            const userModel = UserMapper.toRegistrationModel(UserData);
            user = await this._authUserRepo.create(userModel);
            }

            const accessToken = this._jwtService.generateAccessToken(user._id,"user");
            const refreshToken = this._jwtService.generateRefreshToken(user._id,"user");
            const userData:UserDataDTO={
                name:user.name,
                email:user.email,
                image:user?.image
            }

            return { accessToken, refreshToken,userData};
        } catch (error) {
            console.error("google Login error:", error);

            
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(
                MESSAGES.UNAUTHORIZED_ACCESS,
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );

            
        }
    }
}
