import { container } from "tsyringe";


import { TYPES } from "../../config/constants/types";

import { HashService } from "../../service/helper/hash.service";
import { IHashService } from "../../interface/helpers/hash.interface";
import { EmailService } from "../../service/helper/email-service.service";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";
import {IJwtService} from "../../interface/helpers/jwt-service.service.interface"
import {JwtService} from '../../service/helper/jwt-auth.service'
import {TokenService} from '../../service/shared/token.service'
import {ITokenservice} from '../../interface/service/token.service.interface'

import { LoginService } from "../../service/auth/login.service";
import { ILoginService } from "../../interface/service/auth/login.service.interface";



import {AuthAdminService} from "../../service/admin/auth-admin.service"
import {IAuthAdminService} from "../../interface/service/auth-admin.service.interface"
import { ICloudinaryService } from "../../interface/helpers/cloudinary.service.interface";
import { CloudinaryService } from "../../service/helper/cloudinary.service";
import { IGoogleAuthService } from "../../interface/service/googleAuth.service.interface";
import {GoogleAuthService} from '../../service/shared/googleAuth.service'
import { IManagementAdminService } from "../../interface/service/managementAdmin.service.interface";
import { ManagementAdminService } from "../../service/admin/managementAdmin.service";
import { IResetPassword } from "../../interface/service/resetPassword.service.interface";
import { ResetPassword } from "../../service/shared/resetPassword.service";
import {  IWorkerHelperService } from "../../interface/service/helper-service.service.interface";
import { WorkerHelperService } from "../../service/worker/helper.service";
import { IRegisterService } from "../../interface/service/auth/register.service.interface";
import { RegisterService } from "../../service/auth/register.service";
import { IOtpService } from "../../interface/service/auth/otp.service.interface";
import { OtpService } from "../../service/auth/otp.service";
import { IGoogleService } from "../../interface/service/auth/google.service.interface";
import { GoogleService } from "../../service/auth/googleAuth.service";
import { IGetServices } from "../../interface/service/services/getServices.service.interface";
import { GetServices } from "../../service/services/getService.service";
import { IIsVerified } from "../../interface/service/auth/isVerified.service.interface";
import { IsVerified } from "../../service/auth/isVerified.service";
import { IGetWorkingDetails } from "../../interface/service/worker/getWorkingDetails.service.interface";
import { GetWorkingDetails } from "../../service/worker/getWorkingDetails.service";
import { IUpdateWorkingDetails } from "../../interface/service/worker/updateWorkerDetails.service.interface";
import { UpdateWorkingDetails } from "../../service/worker/updateWorkerDetails.service";
import { IDateConversionService } from "../../interface/service/date-convertion.service.interface";
import { DateConversionService } from "../../service/helper/date-convertion.service";
 






export class ServiceRegistery{
    static registerService():void{

        container.register<IHashService>(TYPES.PasswordService, { useClass: HashService,});
        container.register<IEmailService>(TYPES.EmailService,{useClass:EmailService})
        container.register<IJwtService>(TYPES.JwtService,{useClass:JwtService})
        container.register<IAuthAdminService>(TYPES.AuthAdminService,{useClass:AuthAdminService})
        container.register<ITokenservice>(TYPES.TokenService,{useClass:TokenService})
        container.register<ICloudinaryService>(TYPES.CloudinaryService,{useClass:CloudinaryService})
        container.register<IGoogleAuthService>(TYPES.GoogleAuthService,{useClass:GoogleAuthService})
        container.register<IManagementAdminService>(TYPES.ManagementAdminService,{useClass:ManagementAdminService})
        container.register<IResetPassword>(TYPES.ResetPassword,{useClass:ResetPassword})
        container.register<IWorkerHelperService>(TYPES.WorkerHelperService,{useClass:WorkerHelperService})

        container.register<ILoginService>(TYPES.LoginService,{useClass:LoginService})
        container.register<IRegisterService>(TYPES.RegisterService,{useClass:RegisterService})
        container.register<IOtpService>(TYPES.OtpService,{useClass:OtpService})
        container.register<IGoogleService>(TYPES.GoogleService,{useClass:GoogleService})
        container.register<IGetServices>(TYPES.GetService,{useClass:GetServices})
        container.register<IIsVerified>(TYPES.IsVerified,{useClass:IsVerified})
        container.register<IGetWorkingDetails>(TYPES.GetWorkingDetails,{useClass:GetWorkingDetails})
        container.register<IUpdateWorkingDetails>(TYPES.UpdateWorkingDetails,{useClass:UpdateWorkingDetails})
        container.register<IDateConversionService>(TYPES.DateConversionService,{useClass:DateConversionService})




    }
} 