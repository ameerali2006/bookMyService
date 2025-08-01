import { IWorker } from "../../interface/model/worker.model.interface";
import { WorkerRegisterDTO } from "../../dto/worker/auth/worker-register.dto";
import { IOtp } from "../../interface/model/otp.model.interface";
import { LoginDto } from "../../dto/shared/login.dto";
// import { WorkerDataDTO } from "../../dto/worker/auth/workerData.dto";

export interface IAuthWorkerService {
  registerWorker(data: WorkerRegisterDTO): Promise<IWorker>;
  generateOtp(email: string): Promise<IOtp>;
  verifyOtp(otpData: Omit<IOtp, "expireAt">): Promise<void>;
  login(workerCredential: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    workerData: IWorker;
  }>;
  
}
