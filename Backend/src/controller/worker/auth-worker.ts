import { Request, Response , NextFunction} from "express";
import { injectable, inject } from "tsyringe";
import { TYPES } from "../../config/constants/types.js";
import { MESSAGES } from "../../config/constants/message.js";
import { STATUS_CODES } from "../../config/constants/status-code.js";
import {LoginDto} from "../../dto/shared/login.dto.js"
import {clearAuthCookies, setAuthCookies, updateCookieWithAccessToken} from "../../utils/cookie-helper.js"
import { ITokenservice } from "../../interface/service/token.service.interface.js";
import { CustomRequest } from "../../middleware/auth.middleware.js";
import { IWorkerAuthController } from "../../interface/controller/auth-worker.controller.interface.js";
import { IAuthWorkerService } from "../../interface/service/auth-worker.service.interface.js";
import { WorkerRegisterSchema } from "../validation/worker-register.zod.js";

@injectable()
export class AuthWorkerController implements IWorkerAuthController {
  constructor(
    @inject(TYPES.AuthWorkerService) private _authWorkerService:IAuthWorkerService,
    
    @inject(TYPES.TokenService) private _tokenService:ITokenservice,
    
  ) {}

  
    async generateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
        

        const email: string = req.body.email;
        console.log(`otp generation ${email}`)
        await this._authWorkerService.generateOtp(email);
        res
            .status(STATUS_CODES.CREATED)
            .json({ success: true, message: MESSAGES.OTP_SENT });
        } catch (error) {
        next(error);
        }
        
    }
    async verifyOtp(req: Request, res: Response , next :NextFunction): Promise<void> {
        try {
          await this._authWorkerService.verifyOtp(req.body);
    
          res
            .status(STATUS_CODES.OK)
            .json({ success: true, message: MESSAGES.OTP_VERIFIED });
        } catch (error) {
          next(error);
        }
        
    }
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('worker register')
            const data = req.body;
            console.log(data)
            const schema = WorkerRegisterSchema
            console.log(schema)

            const validatedData = schema.parse(data)
            console.log('after validation')
            await this._authWorkerService.registerWorker(validatedData)
            res.status(STATUS_CODES.CREATED).json({
                success: true,
                message: MESSAGES.REGISTRATION_SUCCESS,
            });
        } catch (error) {
          console.error(error)
            
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const loginCredential: LoginDto = req.body;
        const { refreshToken, accessToken,workerData } = await this._authWorkerService.login(
        loginCredential
      );

      const accessTokenName = "worker_access_token";
      const refreshTokenName = "worker_refresh_token";
      setAuthCookies(
        res,
        accessToken,
        refreshToken,
        accessTokenName,
        refreshTokenName
      )

      res 
        .status(STATUS_CODES.OK)
        .json({ 
          success: true,
          message: MESSAGES.LOGIN_SUCCESS,
          worker: {
            name:workerData.name,
            email:workerData.email,
            image:workerData?.profileImage


          }
        });
    } catch (error) {
      next(error);
    }
    }
  
  handleTokenRefresh(req: Request, res: Response): void {
		try {
			const refreshToken = (req as CustomRequest).user.refresh_token;
			const newTokens = this._tokenService.refreshToken(refreshToken);
			const accessTokenName = `${newTokens.role}_access_token`;
			updateCookieWithAccessToken(
				res,
				newTokens.accessToken,
				accessTokenName
			);
			res.status(STATUS_CODES.OK).json({
				success: true,
				message: MESSAGES.UPDATE_SUCCESS,
			});
		} catch (error) {
			clearAuthCookies(
				res,
				`${(req as CustomRequest).user.role}_access_token`,
				`${(req as CustomRequest).user.role}_refresh_token`
			);
			res.status(STATUS_CODES.UNAUTHORIZED).json({
				message: MESSAGES.INVALID_TOKEN,
			});
		}
	}
  
}