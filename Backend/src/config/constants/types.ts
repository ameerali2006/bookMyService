import { symbol } from "zod";


export const TYPES = {
  AuthUserService: Symbol.for("AuthUserService"),
  PasswordService:Symbol.for('PasswordService'),
  EmailService:Symbol.for('EmailService'),
  JwtService:Symbol.for('JwtService'),
  RedisTokenRepository:Symbol.for("RedisTokenRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),









  AuthUserRepository: Symbol.for("AuthUserRepository"),
  OtpRepository:Symbol.for('OtpRepository'),
  AdminRepository:Symbol.for('AdminRepository'),
  AuthAdminService:Symbol.for('AuthAdminService'),
  TokenService:Symbol.for('TokenService')

  

};