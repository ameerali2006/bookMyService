import { injectable, inject } from "tsyringe";
import { IAuthWorkerService } from "../../interface/service/auth-worker.service.interface";
import { GoogleLoginResponseDTO, responseDto, WorkerRegisterDTO } from "../../dto/worker/auth/worker-register.dto";
import { TYPES } from "../../config/constants/types";
import { MESSAGES } from "../../config/constants/message";
import { STATUS_CODES } from "../../config/constants/status-code";
import { IWorkerRepository } from "../../interface/repository/worker.repository.interface";
import { CustomError } from "../../utils/custom-error";
import { IHashService } from "../../interface/helpers/hash.interface";

import { IEmailService } from "../../interface/helpers/email-service.service.interface";
import { IOtpRepository } from "../../interface/repository/otp.repository.interface";
import { LoginDto } from "../../dto/shared/login.dto";
import { IJwtService } from "../../interface/helpers/jwt-service.service.interface";
import { IOtp } from "../../interface/model/otp.model.interface";
import { IWorker } from "../../interface/model/worker.model.interface";
import { IGoogleInfo } from "../../types/auth.types";
import { IGoogleAuthService } from "../../interface/service/googleAuth.service.interface";
import { WorkerMapper } from "../../utils/mapper/worker-mapper";
import { Types } from "mongoose";
import { WorkerModel } from "../../model/worker.model";


@injectable()
export class AuthWorkerService implements IAuthWorkerService {
    constructor(
        @inject(TYPES.WorkerRepository) private _authWorkerRepo: IWorkerRepository,
        @inject(TYPES.PasswordService) private _passwordHash: IHashService,
        @inject(TYPES.EmailService) private _emailService: IEmailService,
        @inject(TYPES.OtpRepository) private _otpRepo: IOtpRepository,
        @inject(TYPES.JwtService) private _jwtService: IJwtService,
        @inject(TYPES.GoogleAuthService) private _googleAuth:IGoogleAuthService

    ) {}

    async generateOtp(email: string): Promise<IOtp> {
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
        const expireAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

        const hashedOtp = await this._passwordHash.hash(otp);

        const otpData: Partial<IOtp> = {
            email,
            otp: hashedOtp,
            expireAt,
        };
        console.log('workerOtp',otp)

        const content = this._emailService.generateOtpEmailContent(otp);
        await this._emailService.sendEmail(email, "OTP Verification", content);

        return await this._otpRepo.create(otpData);
    }
    async verifyOtp(otpData: Omit<IOtp, "expireAt">): Promise<void> {
        const data = await this._otpRepo.findOtp(otpData.email);

        if (!data || new Date() > new Date(data.expireAt)) {
            throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
        }

        const isOtpValid = await this._passwordHash.compare(otpData.otp, data.otp);
        if (!isOtpValid) {
            throw new CustomError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
        }
        console.log('verify cheythu')

        const existing = await this._authWorkerRepo.findByEmail(otpData.email);
        if (existing) {
            throw new CustomError("Email already exists", STATUS_CODES.CONFLICT);
        }
    }

    async registerWorker(workerData: WorkerRegisterDTO): Promise<{accessToken:string; refreshToken:string; workerDto:responseDto}> {
        console.log('registerWorker')
        const existing = await this._authWorkerRepo.findByEmail(workerData.email);
        if (existing) {
            throw new CustomError(MESSAGES.ALREADY_EXISTS, STATUS_CODES.CONFLICT);
        }

        if (!workerData.password) {
            throw new CustomError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
        }

        
        const hashedPassword = await this._passwordHash.hash(workerData.password);

        
        const dbWorker: Partial<IWorker> = {
            name: workerData.name,
            email: workerData.email,
            phone: workerData.phone,
            password: hashedPassword,

            location: {
            lat: parseFloat(workerData.latitude),
            lng: parseFloat(workerData.longitude),
            },

            zone: workerData.zone,
            category: workerData.category,
            experience: workerData.experience,
            documents: workerData.documents,

            
        };
        const workerDbData=await this._authWorkerRepo.create(dbWorker);
        const accessToken = this._jwtService.generateAccessToken(workerDbData._id.toString(),"worker");
        const refreshToken = this._jwtService.generateRefreshToken(workerDbData._id.toString(),"worker");

        const workerDto=WorkerMapper.responseWorkerDto(workerDbData)


        

        return  {
            accessToken,
            refreshToken,
            workerDto
        }
    }
    async login(workerCredential: LoginDto): Promise<{ accessToken: string; refreshToken: string; workerDto: responseDto; }> {
        try {
            const workerData: IWorker | null = await this._authWorkerRepo.findByEmail(workerCredential.email);
            console.log(workerData)

            if (!workerData) {
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
                );
            }
            if (!workerData.password) {
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
                );
            }

            const isPasswordValid: boolean =
            await this._passwordHash.compare(
                workerCredential.password,
                workerData.password
            );
            if (!isPasswordValid) {
                console.log('password wrong')
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.UNAUTHORIZED
                );
            }

            const accessToken = this._jwtService.generateAccessToken(workerData._id.toString(),"worker");
            const refreshToken = this._jwtService.generateRefreshToken(workerData._id.toString(),"worker");

            const workerDto=WorkerMapper.responseWorkerDto(workerData)


            return { accessToken, refreshToken,workerDto };            
            
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
    
    async googleAuth(token: string): Promise<GoogleLoginResponseDTO> {
        try {
            const ticket:IGoogleInfo=await this._googleAuth.verifyToken(token)
            const { email, name, sub: googleId, picture } = ticket;

            const existingWorker=await this._authWorkerRepo.findByEmail(email)
            if(existingWorker){
                const accessToken=this._jwtService.generateAccessToken(existingWorker._id.toString(),"worker")
                const refreshToken= this._jwtService.generateRefreshToken(existingWorker._id.toString(),"worker")

                return {
                    success: true,
                    message: "Login success",
                    accessToken,
                    refreshToken,
                    user: {
                        _id: existingWorker._id.toString(),
                        email: existingWorker.email,
                        name: existingWorker.name,
                        googleId,
                        profileImage: existingWorker.profileImage || null,
                    },
                    isNew: false,
                };
                
            }
            return {
                success: true,
                message: "Google user verified",
                accessToken:null,
                refreshToken:null,
                user: {
                    email,
                    name,
                    googleId,
                    profileImage: picture || null,
                },
                isNew: true,
            };
        } catch (error) {
           
            console.error("Google Auth Error:", error);

            return {
                success: false,
                message: "Google authentication failed",
                accessToken: null,
                refreshToken: null,
                user: null,
                isNew: false,
            };

            
        }
    }
    async isVerified(email:string): Promise<{ _id: string|null; status: string|null }> {
        try {
            const data =await this._authWorkerRepo.findByEmail(email)
            if(!data){
                return {
                    _id:null,
                    status:null
                }
            }
            return {
                _id:data._id.toString(),
                status:data.isVerified
            }
        } catch (error) {
            console.error("isverified:", error);
            return {
                    _id:null,
                    status:null
            }
        }
    }

}
