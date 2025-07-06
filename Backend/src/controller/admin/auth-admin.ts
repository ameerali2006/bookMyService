import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../../dto/shared/login.dto";
import { IAuthAdminService } from "../../interface/service/auth-admin.service.interface";
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";
import { TYPES } from "../../config/constants/types";
import { injectable, inject } from "tsyringe";
@injectable()
export class AuthAdminController {
  constructor(
    @inject(TYPES.AuthAdminService) private _authAdminService: IAuthAdminService
  ) {}
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginCredential: LoginDto = req.body;
      const { refreshToken, accessToken } = await this._authAdminService.login(
        loginCredential
      );
      res.cookie("adminRefreshToken", refreshToken, {
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
} 