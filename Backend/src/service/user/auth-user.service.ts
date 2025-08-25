import { injectable,inject} from "tsyringe";
import { IAuthUserService } from "../../interface/service/auth-user.service.interface";
import { UserRegisterDTO } from "../../dto/user/auth/user-register.dto";
import { UserDataDTO } from "../../dto/user/auth/userData.dto";
import {TYPES} from '../../config/constants/types'
import {MESSAGES} from '../../config/constants/message'
import {STATUS_CODES} from '../../config/constants/status-code'
import { IUserRepository } from "../../interface/repository/user.repository.interface";
import { CustomError } from "../../utils/custom-error";
import { IHashService } from "../../interface/helpers/hash.interface";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";
import { IOtpRepository } from "../../interface/repository/otp.repository.interface";
import { LoginDto } from "../../dto/shared/login.dto";
import { IJwtService } from "../../interface/helpers/jwt-service.service.interface";
import { OAuth2Client } from "google-auth-library";
import {UserMapper} from "../../utils/mapper/user-mapper"
import { ENV } from "../../config/env/env";
import { IUser } from "../../interface/model/user.model.interface";
import { IOtp } from "../../interface/model/otp.model.interface";
import { IGoogleAuthService } from "../../interface/service/googleAuth.service.interface";
import { IGoogleInfo } from "../../types/auth.types";
import { serviceCreateDto, serviceManageDto } from "../../dto/admin/management.dto";
import { IServiceRepository } from "../../interface/repository/service.repository.interface";

@injectable()
export class AuthUserService implements IAuthUserService {

    constructor(
        @inject(TYPES.AuthUserRepository) private _authUserRepo:IUserRepository,
        @inject(TYPES.PasswordService) private _passwordHash:IHashService,
        @inject(TYPES.EmailService) private _emailService:IEmailService,
        @inject(TYPES.OtpRepository) private _otpRepo:IOtpRepository,
        @inject(TYPES.JwtService) private _jwtService:IJwtService,
        @inject(TYPES.GoogleAuthService) private _googleAuth:IGoogleAuthService,
        @inject(TYPES.ServiceRepository) private _serviceRepo:IServiceRepository


    ){}
    async registerUser(userData: UserRegisterDTO):  Promise<{ accessToken: string; refreshToken: string; userData:UserDataDTO}>{
        try {
            console.log(userData)
            const existingUser=await this._authUserRepo.findByEmail(userData.email)
            if(existingUser){
                throw new CustomError(MESSAGES.ALREADY_EXISTS,STATUS_CODES.CONFLICT)
            }
            if (!userData.password) {
                throw new CustomError(MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED);
            }
            userData.password=await this._passwordHash.hash(userData.password)
            const userDbData= await this._authUserRepo.create(userData)
            const userDto =UserMapper.resposeWorkerDto(userDbData)

            const accessToken = this._jwtService.generateAccessToken(userDbData._id,"user");
            const refreshToken = this._jwtService.generateRefreshToken(userDbData._id,"user");


            return {
                accessToken,
                refreshToken,
                userData:userDto
            }

        } catch (error) {
             throw error instanceof CustomError
            ? error
            : new CustomError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
            
        }

    
    }
    async generateOtp(email: string): Promise<IOtp> {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expireAt: Date = new Date(Date.now() + 2 * 60 * 1000);
        console.log("otp",otp)
        const hashedOtp = await this._passwordHash.hash(String(otp));

        const otpdata: Partial<IOtp> = {
        email,
        otp: hashedOtp, // store hashed OTP
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

            const user: IUser | null = await this._authUserRepo.findByEmail(otpData.email);
            if (user) {
                throw new CustomError("Email already exists", STATUS_CODES.CONFLICT);
            }

            const isValid = await this._passwordHash.compare(
            String(otpData.otp),
            data.otp
            );
            if (!isValid) {
            throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
            }

            if (currentTime > otpExpiryTime) {
            throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
            }
        } catch (error) {
            console.error("verify otp :", error);
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
            await this._passwordHash.compare(
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
            
            
            const payload:IGoogleInfo = await this._googleAuth.verifyToken(googleToken)
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
    async getAllServices(): Promise<{ services: serviceCreateDto[]; }> {
        try {
            const {items,total} =await this._serviceRepo.findAll({status:"active"})
            return {
                services:items
            }
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
    
}
 