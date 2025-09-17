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



import { IResetPassword } from "../../interface/service/resetPassword.service.interface.js";
import { Types } from "mongoose";
import { ILoginService } from "../../interface/service/auth/login.service.interface.js";
import { schemasByRole } from "../validation/register.zod.js";
import { IRegisterService } from "../../interface/service/auth/register.service.interface.js";
import { IOtpService } from "../../interface/service/auth/otp.service.interface.js";
import { IGoogleService } from "../../interface/service/auth/google.service.interface.js";
import { IIsVerified } from "../../interface/service/auth/isVerified.service.interface.js";


@injectable()
export class AuthWorkerController implements IWorkerAuthController {
  constructor(

    @inject(TYPES.TokenService) private _tokenService:ITokenservice,
    @inject(TYPES.ResetPassword) private _resetPassword:IResetPassword,
    @inject(TYPES.LoginService) private _Login:ILoginService,
    @inject(TYPES.RegisterService) private _Register:IRegisterService,
    @inject(TYPES.OtpService) private _Otp:IOtpService,
    @inject(TYPES.GoogleService) private _googleLogin:IGoogleService,
    @inject(TYPES.IsVerified) private _isVerified:IIsVerified

    
    
  ) {}

  
    async generateOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
        

        const email: string = req.body.email;
        console.log(`otp generation ${email}`)
        await this._Otp.generate(email);
        res
            .status(STATUS_CODES.CREATED)
            .json({ success: true, message: MESSAGES.OTP_SENT });
        } catch (error) {
        next(error);
        }
        
    }
    async verifyOtp(req: Request, res: Response , next :NextFunction): Promise<void> {
        try {
          const {otp,email,role}=req.body
          
          await this._Otp.verify({email,otp,role});
    
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
            const schema = schemasByRole["worker"]
            console.log(schema)

            const validatedData = schema.parse(data)
            console.log('after validation')
            const Data = await this._Register.execute({...validatedData,category:new Types.ObjectId(validatedData.category)})
            if(Data.accessToken&&Data.refreshToken){
              const accessTokenName = "access_token";
              const refreshTokenName = "refresh_token";
              setAuthCookies(
                res,
                Data.accessToken,
                Data.refreshToken,
                accessTokenName,
                refreshTokenName
              )

            }
            res.status(STATUS_CODES.CREATED).json({
                success: true,
                message: MESSAGES.REGISTRATION_SUCCESS,
                worker:Data.user
            });
        } catch (error) {
          console.error(error)
            
        }
    }
    async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {token,role} =req.body
        const result=await this._googleLogin.execute(token,role)
        if(!result.success){
          res.status(STATUS_CODES.BAD_REQUEST).json(result)
        }
        if(!result.isNew&&result.accessToken&&result.refreshToken){
          const accessTokenName = "access_token";
          const refreshTokenName = "refresh_token";
          setAuthCookies(
            res,
            result.accessToken,
            result.refreshToken,
            accessTokenName,
            refreshTokenName
          )

        }
        const { accessToken, refreshToken, ...cleanedData } = result;
        res.status(STATUS_CODES.OK).json(cleanedData);


      } catch (error) {
        console.error("Google Auth Controller Error:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Something went wrong during Google authentication",
        });
        
      }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const loginCredential: LoginDto = req.body;
          const {success,message, refreshToken, accessToken,user:workerDto } = await this._Login.execute(
          loginCredential
        );
        if(!success){
          res 
          .status(STATUS_CODES.CONFLICT)
          .json({ 
            success ,
            message,
            worker: workerDto
          });
          
        }

        if(accessToken&&refreshToken){
          const accessTokenName = "access_token";
          const refreshTokenName = "refresh_token";
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
              worker: workerDto
            });
        }
      } catch (error) {
        next(error);
      }
    }
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {email}=req.body
			if (!email) {
				res.status(STATUS_CODES.BAD_REQUEST).json({
					success: false,
					message: MESSAGES.VALIDATION_ERROR,
				});
				
			}
      await this._resetPassword.forgotPassword(email,"worker");

			res.status(STATUS_CODES.OK).json({
				success: true,
				message: MESSAGES.EMAIL_VERIFICATION_SENT,
			});
    } catch (error) {
      next(error)
    }
    
  }
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("resetPassword-controller")
      const {token,password,} =req.body
      if (!token||!password) {
				res.status(STATUS_CODES.BAD_REQUEST).json({
					success: false,
					message: MESSAGES.VALIDATION_ERROR,
				});
			}

			await this._resetPassword.resetPassword(token,password,"worker");
			res.status(STATUS_CODES.OK).json({
				success: true,
				message: MESSAGES.PASSWORD_RESET_SUCCESS,
			});
    } catch (error) {
      next(error)
    }
    
  }

  async handleTokenRefresh(req: Request, res: Response):Promise <void >{
		try {
			const refreshToken = (req as CustomRequest).user.refresh_token;
			const newTokens = await this._tokenService.refreshToken(refreshToken);
			const accessTokenName = `access_token`;
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
				`access_token`,
				`refresh_token`
			);
			res.status(STATUS_CODES.UNAUTHORIZED).json({
				message: MESSAGES.INVALID_TOKEN,
			});
		}
	} 
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      console.log('log out')

      console.log('helooo log out')
      
			await this._tokenService.blacklistToken(
				(req as CustomRequest).user.access_token
			);
      console.log('1')

			await this._tokenService.revokeRefreshToken(
				(req as CustomRequest).user.refresh_token
			);
      console.log('12')
      const user = (req as CustomRequest).user;
			const accessTokenName = `access_token`;
			const refreshTokenName = `refresh_token`;
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
  async isVerified(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = req.query.email
      if(!email){
        res.status(STATUS_CODES.BAD_REQUEST).json({
					success: false,
					message: MESSAGES.VALIDATION_ERROR,
				});
      }
      const data=await this._isVerified.execute(String(email))
      if(!data._id||!data.status){
      
				res.status(STATUS_CODES.BAD_REQUEST).json({
					success: false,
					message: MESSAGES.VALIDATION_ERROR,
				});
			
      }
      res.status(STATUS_CODES.OK).json({
				success: true,
				message: MESSAGES.LOGOUT_SUCCESS,
        ...data
			});
      
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
					success: false,
					message: MESSAGES.VALIDATION_ERROR,
				});
    }
    
  }
  
}