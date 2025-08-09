import { inject, injectable } from "tsyringe";
import { TYPES } from "../../config/constants/types";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";
import { IHashService } from "../../interface/helpers/hash.interface";
import { IOtpRepository } from "../../interface/repository/otp.repository.interface";
import { IUserRepository } from "../../interface/repository/user.repository.interface";
import { IResetPassword } from "../../interface/service/resetPassword.service.interface";
import { IWorkerRepository } from "../../interface/repository/worker.repository.interface";
import { MESSAGES } from "../../config/constants/message";
import { CustomError } from "../../utils/custom-error";
import { STATUS_CODES } from "../../config/constants/status-code";
import { IJwtService } from "../../interface/helpers/jwt-service.service.interface";
import { RedisTokenRepository } from "../../repository/shared/redis.repository";
import { ResetTokenPayload } from "../helper/jwt-auth.service";
import { ENV } from "../../config/env/env";
@injectable()
export class ResetPassword implements IResetPassword{
    constructor(
        @inject(TYPES.AuthUserRepository) private _authUserRepo:IUserRepository,
        @inject(TYPES.PasswordService) private _passwordHash:IHashService,
        @inject(TYPES.EmailService) private _emailService:IEmailService,
        @inject(TYPES.OtpRepository) private _otpRepo:IOtpRepository,
        @inject(TYPES.WorkerRepository) private _workerRepo:IWorkerRepository,
        @inject(TYPES.JwtService) private _jwtService:IJwtService,
        @inject(TYPES.RedisTokenRepository) private _redisRepo:RedisTokenRepository,
    ) {
        
    }
    async forgotPassword(email: string, role: "worker" | "user"): Promise<void> {
        try {
            let Repository
            if(role=="user"){
                Repository=this._authUserRepo
            }else if(role=='worker'){
                Repository=this._workerRepo
            }else{
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.FORBIDDEN
                )
            }
            const user = await Repository.findOne({email})
            if(!user){
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.FORBIDDEN
                )
                
            }
            
            const resetToken = this._jwtService.generateResetToken(email);
            console.log(user._id ?? "",
				resetToken)
            if (!user._id) {
                throw new CustomError("User ID missing", STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
            const redis=await this._redisRepo.storeResetToken(
				user._id.toString(),
				resetToken
			);
            console.log("redis",redis)
            const rolePrefix = role !== "user" ? `/${role}` : "";
            const resetUrl = new URL(
                `${rolePrefix}/reset-password/${resetToken}`,
                ENV.FRONTEND_URI
            ).toString();

            await this._emailService.sendResetEmail(
                email,
                "BookMyService - Reset your password",
                resetUrl
            );


        } catch (error) {
            console.error("Failed to store reset token in Redis:", error);
			throw new CustomError(
				MESSAGES.SERVER_ERROR,
				STATUS_CODES.INTERNAL_SERVER_ERROR
			);
        }
        
    }
    async resetPassword(token: string, password: string, role: "worker" | "user"): Promise<void> {
        try {
            console.log('resetPassword')
            const payload = this._jwtService.verifyResetToken(token) as ResetTokenPayload;
            if (!payload || !payload.email) {
                throw new CustomError(
                    MESSAGES.INVALID_TOKEN,
                    STATUS_CODES.BAD_REQUEST
                );
            }

            const email = payload.email;
		    let repository;
            if (role === "user") {
			    repository = this._authUserRepo;
            } else if (role === "worker") {
                repository = this._workerRepo;
            } else {
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS,
                    STATUS_CODES.FORBIDDEN
                );
            }
            const user = await repository.findOne({ email });
            if (!user) {
                throw new CustomError(
                    MESSAGES.USER_NOT_FOUND,
                    STATUS_CODES.NOT_FOUND
                );
            }
            console.log(user._id+"***************"+token)
            const tokenValid = await this._redisRepo.verifyResetToken(
                user._id ?? "",
                token
            );
            console.log(tokenValid)
            if (!tokenValid) {
                throw new CustomError(
                    MESSAGES.INVALID_TOKEN,
                    STATUS_CODES.BAD_REQUEST
                );
            }

            const isSamePasswordAsOld = await this._passwordHash.compare(
                password,
                user.password
            );
            if (isSamePasswordAsOld) {
                throw new CustomError(
                    MESSAGES.SAME_CURR_NEW_PASSWORD,
                    STATUS_CODES.BAD_REQUEST
                );
            }

            const hashedPassword = await this._passwordHash.hash(password);

            await repository.update({ email }, { password: hashedPassword });

            await this._redisRepo.deleteResetToken(user._id ?? "");
            
        } catch (error) {
            
        }
    }
}