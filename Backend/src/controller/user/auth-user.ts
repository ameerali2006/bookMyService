import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IAuthController } from '../../interface/controller/auth-user.controller.interface.js';
import { TYPES } from '../../config/constants/types.js';
import { MESSAGES } from '../../config/constants/message.js';
import { STATUS_CODES } from '../../config/constants/status-code.js';
import { LoginDto } from '../../dto/shared/login.dto.js';
import { clearAuthCookies, setAuthCookies, updateCookieWithAccessToken } from '../../utils/cookie-helper.js';
import { ITokenservice } from '../../interface/service/token.service.interface.js';
import { CustomRequest } from '../../middleware/auth.middleware.js';
import { IResetPassword } from '../../interface/service/resetPassword.service.interface.js';
import { ILoginService } from '../../interface/service/auth/login.service.interface.js';
import { schemasByRole } from '../validation/register.zod.js';
import { IRegisterService } from '../../interface/service/auth/register.service.interface.js';
import { IOtpService } from '../../interface/service/auth/otp.service.interface.js';
import { IGoogleService } from '../../interface/service/auth/google.service.interface.js';
import { CustomError } from '../../utils/custom-error.js';

@injectable()
export class AuthUserController implements IAuthController {
  constructor(

    @inject(TYPES.TokenService) private _tokenService:ITokenservice,
    @inject(TYPES.ResetPassword) private _resetPassword:IResetPassword,
    @inject(TYPES.RegisterService) private _Register:IRegisterService,
    @inject(TYPES.LoginService) private _Login:ILoginService,
    @inject(TYPES.OtpService) private _Otp:IOtpService,
    @inject(TYPES.GoogleService) private _googleAuth:IGoogleService,

  ) {}

  async register(req: Request, res: Response, next:NextFunction) {
    try {
      const UserData = req.body as {role :keyof typeof schemasByRole};
      const schema = schemasByRole.user;
      const result = schema.parse(UserData);

      const { accessToken, refreshToken, user: userData } = await this._Register.execute(result);
      const accessTokenName = 'access_token';
      const refreshTokenName = 'refresh_token';
      setAuthCookies(
        res,
        accessToken,
        refreshToken,
        accessTokenName,
        refreshTokenName,
      );

      res.status(STATUS_CODES.CREATED).json({ success: true, message: MESSAGES.REGISTRATION_SUCCESS, userData });
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: MESSAGES.REGISTRATION_FAILED });
      next(error);
    }
  }

  async generateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      console.log(`otp generation ${email}`);
      await this._Otp.generate(email);
      res
        .status(STATUS_CODES.CREATED)
        .json({ success: true, message: MESSAGES.OTP_SENT });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next :NextFunction): Promise<void> {
    try {
      await this._Otp.verify(req.body);

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
      const {
        success, message, refreshToken, accessToken, user: userData,
      } = await this._Login.execute(
        loginCredential,
      );

      if (success && accessToken && refreshToken && userData) {
        const accessTokenName = 'access_token';
        const refreshTokenName = 'refresh_token';
        setAuthCookies(
          res,
          accessToken,
          refreshToken,
          accessTokenName,
          refreshTokenName,
        );
        const profilePic = 'image' in userData
          ? userData.image
          : 'profileImage' in userData
            ? userData.profileImage
            : undefined;
        res
          .status(STATUS_CODES.OK)
          .json({
            success: true,
            message: MESSAGES.LOGIN_SUCCESS,
            user: {
              _id: userData._id,
              name: userData.name,
              email: userData.email,
              image: profilePic,

            },
          });
      } else {
        res
          .status(STATUS_CODES.OK)
          .json({
            success,
            message,
            user: null,
          });
      }
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    console.log('google login - user');
    try {
      const { token, role } = req.body;
      const {
        success, message, refreshToken, accessToken, user, isNew,
      } = await this._googleAuth.execute(token, role);
      if (!isNew && accessToken && refreshToken && user) {
        const accessTokenName = 'access_token';
        const refreshTokenName = 'refresh_token';
        setAuthCookies(
          res,
          accessToken,
          refreshToken,
          accessTokenName,
          refreshTokenName,
        );

        res
          .status(STATUS_CODES.OK)
          .json({
            success: true,
            message: MESSAGES.LOGIN_SUCCESS,
            user: {
              name: user.name,
              email: user.email,
              image: user?.email,

            },
          });
      } else {
        throw new CustomError(MESSAGES.REGISTRATION_FAILED, STATUS_CODES.BAD_REQUEST);
      }
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('log out');

      await this._tokenService.blacklistToken(
        (req as CustomRequest).user.access_token,
      );
      console.log('1');

      await this._tokenService.revokeRefreshToken(
        (req as CustomRequest).user.refresh_token,
      );
      console.log('12');
      const { user } = (req as CustomRequest);
      const accessTokenName = 'access_token';
      const refreshTokenName = 'refresh_token';
      clearAuthCookies(res, accessTokenName, refreshTokenName);
      console.log('13');
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next :NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
        });
      }
      await this._resetPassword.forgotPassword(email, 'user');

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.EMAIL_VERIFICATION_SENT,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next :NextFunction): Promise<void> {
    try {
      console.log('resetPassword-controller');
      const { token, password } = req.body;
      if (!token || !password) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
        });
      }

      await this._resetPassword.resetPassword(token, password, 'user');
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.PASSWORD_RESET_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleTokenRefresh(req: Request, res: Response):Promise<void> {
    try {
      const refreshToken = (req as CustomRequest).user.refresh_token;
      const newTokens = await this._tokenService.refreshToken(refreshToken);
      const accessTokenName = 'access_token';
      updateCookieWithAccessToken(
        res,
        newTokens.accessToken,
        accessTokenName,
      );
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      clearAuthCookies(
        res,
        'access_token',
        'refresh_token',
      );
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: MESSAGES.INVALID_TOKEN,
      });
    }
  }
}
