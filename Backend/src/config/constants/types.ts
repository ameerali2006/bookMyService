import { symbol } from "zod";


export const TYPES = {
  AuthUserService: Symbol.for("AuthUserService"),
  PasswordService:Symbol.for('PasswordService'),
  EmailService:Symbol.for('EmailService'),
  JwtService:Symbol.for('JwtService'),
  RedisTokenRepository:Symbol.for("RedisTokenRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  WorkingDetailsRepository: Symbol.for("WorkingDetailsRepository"),

  WorkerRepository: Symbol.for("WorkerRepository"),
  AuthWorkerService:Symbol.for("AuthWorkerService"),
  CloudinaryService:Symbol.for("CloudinaryService"),
  GetWorkingDetails:Symbol.for("GetWorkingDetails"),
  UpdateWorkingDetails:Symbol.for("UpdateWorkingDetails"),

  LoginService:Symbol.for("LoginService"),
  RegisterService:Symbol.for("RegisterService"),
  OtpService:Symbol.for("OtpService"),
  GoogleService:Symbol.for("GoogleService"),
  GetService:Symbol.for("GetService"),
  IsVerified:Symbol.for("IsVerified"),
  ProfileManagement:Symbol.for("ProfileManagement"),
  AuthUserRepository: Symbol.for("AuthUserRepository"),
  OtpRepository:Symbol.for('OtpRepository'),
  AdminRepository:Symbol.for('AdminRepository'),
  AuthAdminService:Symbol.for('AuthAdminService'),
  TokenService:Symbol.for('TokenService'),
  GoogleAuthService:Symbol.for('GoogleAuthService'),
  ManagementAdminService:Symbol.for('ManagementAdminService'),
  ResetPassword:Symbol.for('ResetPassword'),
  ServiceRepository:Symbol.for('ServiceRepository'),
  WorkerHelperService:Symbol.for('WorkerHelperService'),

  DateConversionService:Symbol.for('DateConversionService'),

};