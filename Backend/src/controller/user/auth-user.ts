import { Request, Response , NextFunction} from "express";
import { injectable, inject } from "tsyringe";
import { IAuthUserService } from "../../interface/service/auth-user.service.interface.js";
import { IAuthController } from "../../interface/controller/auth-user.controller.interface.js";
import { TYPES } from "../../config/constants/types.js";
import { MESSAGES } from "../../config/constants/message.js";
import { STATUS_CODES } from "../../config/constants/status-code.js";
import {LoginDto} from "../../dto/shared/login.dto.js"

@injectable()
export class AuthUserController implements IAuthController {
  constructor(
    @inject(TYPES.AuthUserService) private _authUserService: IAuthUserService
  ) {}

  async register(req: Request, res: Response,next:NextFunction) {
    try {
      const userData = req.body;
      await this._authUserService.registerUser(userData);
      res.status(STATUS_CODES.CREATED).json({ message:MESSAGES.REGISTRATION_SUCCESS  });
    } catch (error) {
      next(error)
      
    }
  }
  async generateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      

      const email: string = req.body.email;
      console.log(`otp generation ${email}`)
      await this._authUserService.generateOtp(email);
      res
        .status(STATUS_CODES.CREATED)
        .json({ success: true, message: MESSAGES.OTP_SENT });
    } catch (error) {
      next(error);
    }
    
  }
  async verifyOtp(req: Request, res: Response , next :NextFunction): Promise<void> {
    try {
      await this._authUserService.verifyOtp(req.body);

      res
        .status(STATUS_CODES.OK)
        .json({ success: true, message: MESSAGES.OTP_VERIFIED });
    } catch (error) {
      next(error);
    }
    
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginCredential: LoginDto = req.body;
      const { refreshToken, accessToken } = await this._authUserService.login(
        loginCredential
      );

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res 
        .status(STATUS_CODES.OK)
        .json({ success: true, message: MESSAGES.LOGIN_SUCCESS, accessToken });
    } catch (error) {
      next(error);
    }
  }
  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const googleToken: string = req.body.token;
      const { refreshToken, accessToken } =
        await this._authUserService.googleLogin(googleToken);
      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(STATUS_CODES.CREATED)
        .json({ success: true, message: MESSAGES.LOGIN_SUCCESS, accessToken });
    } catch (error) {
      next(error);
    }
  }
  
}