import { injectable, inject } from "tsyringe";
import { IAuthWorkerService } from "../../interface/service/auth-worker.service.interface";
import { WorkerRegisterDTO } from "../../dto/worker/auth/worker-register.dto";
import { TYPES } from "../../config/constants/types";
import { MESSAGES } from "../../config/constants/message";
import { STATUS_CODES } from "../../config/constants/status-code";
import { IWorkerRepository } from "../../interface/repository/worker.repository.interface";
import { CustomError } from "../../utils/custom-error";
import { IHashService } from "../../interface/helpers/hash.interface";
import { IWorker } from "../../model/worker.model";
import { IOtp } from "../../model/otp.model";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";
import { IOtpRepository } from "../../interface/repository/otp.repository.interface";

@injectable()
export class AuthWorkerService implements IAuthWorkerService {
    constructor(
        @inject(TYPES.WorkerRepository) private _authWorkerRepo: IWorkerRepository,
        @inject(TYPES.PasswordService) private _passwordHash: IHashService,
        @inject(TYPES.EmailService) private _emailService: IEmailService,
        @inject(TYPES.OtpRepository) private _otpRepo: IOtpRepository
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

    async registerWorker(workerData: WorkerRegisterDTO): Promise<IWorker> {
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
        console.log(dbWorker)

        return await this._authWorkerRepo.create(dbWorker);
    }

}
