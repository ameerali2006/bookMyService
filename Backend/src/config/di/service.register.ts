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

import { IAuthUserService } from "../../interface/service/auth-user.service.interface";
import { AuthUserService } from "../../service/user/auth-user.service";
import {AuthAdminService} from "../../service/admin/auth-admin.service"
import {IAuthAdminService} from "../../interface/service/auth-admin.service.interface"
import { IAuthWorkerService } from "../../interface/service/auth-worker.service.interface";
import { AuthWorkerService } from "../../service/worker/auth-worker.service";
import { ICloudinaryService } from "../../interface/helpers/cloudinary.service.interface";
import { CloudinaryService } from "../../service/helper/cloudinary.service";
import { IGoogleAuthService } from "../../interface/service/googleAuth.service.interface";
import {GoogleAuthService} from '../../service/shared/googleAuth.service'
 






export class ServiceRegistery{
    static registerService():void{
        container.register<IAuthUserService>(TYPES.AuthUserService, { useClass: AuthUserService, });
        container.register<IHashService>(TYPES.PasswordService, { useClass: HashService,});
        container.register<IEmailService>(TYPES.EmailService,{useClass:EmailService})
        container.register<IJwtService>(TYPES.JwtService,{useClass:JwtService})
        container.register<IAuthAdminService>(TYPES.AuthAdminService,{useClass:AuthAdminService})
        container.register<ITokenservice>(TYPES.TokenService,{useClass:TokenService})
        container.register<IAuthWorkerService>(TYPES.AuthWorkerService,{useClass:AuthWorkerService})
        container.register<ICloudinaryService>(TYPES.CloudinaryService,{useClass:CloudinaryService})
        container.register<IGoogleAuthService>(TYPES.GoogleAuthService,{useClass:GoogleAuthService})


        

    }
}