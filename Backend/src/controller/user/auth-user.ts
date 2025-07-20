import { Request, Response , NextFunction} from "express";
import { injectable, inject } from "tsyringe";
import { IAuthUserService } from "../../interface/service/auth-user.service.interface.js";
import { IAuthController } from "../../interface/controller/auth-user.controller.interface.js";
import { TYPES } from "../../config/constants/types.js";
import { MESSAGES } from "../../config/constants/message.js";
import { STATUS_CODES } from "../../config/constants/status-code.js";
import {LoginDto} from "../../dto/shared/login.dto.js"
import {clearAuthCookies, setAuthCookies, updateCookieWithAccessToken} from "../../utils/cookie-helper.js"
import { ITokenservice } from "../../interface/service/token.service.interface.js";
import { CustomRequest } from "../../middleware/auth.middleware.js";

@injectable()
export class AuthUserController implements IAuthController {
  constructor(
    @inject(TYPES.AuthUserService) private _authUserService: IAuthUserService,
    @inject(TYPES.TokenService) private _tokenService:ITokenservice,
    
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
      const { refreshToken, accessToken,userData } = await this._authUserService.login(
        loginCredential
      );

      const accessTokenName = "user_access_token";
      const refreshTokenName = "user_refresh_token";
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
          user: {
            name:userData.name,
            email:userData.email,
            image:userData?.image


          }
        });
    } catch (error) {
      next(error);
    }
  }
  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const googleToken: string = req.body.token;
      const { refreshToken, accessToken ,userData} =
        await this._authUserService.googleLogin(googleToken);
      const accessTokenName = "user_access_token";
      const refreshTokenName = "user_refresh_token";
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
          user: {
            name:userData.name,
            email:userData.email,
            image:userData?.email 


          }
        });
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      console.log('log out')
      
			await this._tokenService.blacklistToken(
				(req as CustomRequest).user.access_token
			);
      console.log('1')

			await this._tokenService.revokeRefreshToken(
				(req as CustomRequest).user.refresh_token
			);
      console.log('12')
      const user = (req as CustomRequest).user;
			const accessTokenName = `user_access_token`;
			const refreshTokenName = `user_refresh_token`;
			clearAuthCookies(res, accessTokenName, refreshTokenName);
      console.log('13')
			res.status(STATUS_CODES.OK).json({
				success: true,
				message: MESSAGES.LOGOUT_SUCCESS,
			});

    } catch (error) {
      console.error(error)
      
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