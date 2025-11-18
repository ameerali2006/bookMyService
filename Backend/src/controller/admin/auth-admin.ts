import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { LoginDto } from '../../dto/shared/login.dto';
import { IAuthAdminService } from '../../interface/service/auth-admin.service.interface';
import { STATUS_CODES } from '../../config/constants/status-code';
import { MESSAGES } from '../../config/constants/message';
import { TYPES } from '../../config/constants/types';
import { clearAuthCookies, setAuthCookies } from '../../utils/cookie-helper';

import { IAdminController } from '../../interface/controller/auth-admin.controller.interface';
import { CustomRequest } from '../../middleware/auth.middleware';
import { ITokenservice } from '../../interface/service/token.service.interface';
import { ILoginService } from '../../interface/service/auth/login.service.interface';

@injectable()
export class AuthAdminController implements IAdminController {
  constructor(
    @inject(TYPES.AuthAdminService) private _authAdminService: IAuthAdminService,
    @inject(TYPES.TokenService) private _tokenService:ITokenservice,

    @inject(TYPES.LoginService) private _Login:ILoginService,
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginCredential: LoginDto = req.body;
      const {
        message, success, refreshToken, accessToken, user: admin,
      } = await this._Login.execute(
        loginCredential,
      );
      if (success && refreshToken && accessToken) {
        const accessTokenName = 'access_token';
        const refreshTokenName = 'refresh_token';
        setAuthCookies(res, accessToken, refreshToken, accessTokenName, refreshTokenName);
        res
          .status(STATUS_CODES.OK)
          .json({ success: true, message: MESSAGES.LOGIN_SUCCESS, admin });
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
}
