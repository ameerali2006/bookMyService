import { container } from "tsyringe";


import { TYPES } from "../../config/constants/types";

import { PasswordService } from "../../service/helper/password-hash.service";
import { IPasswordService } from "../../interface/helpers/password-hash.interface";
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
 






export class ServiceRegistery{
    static registerService():void{
        container.register<IAuthUserService>(TYPES.AuthUserService, { useClass: AuthUserService, });
        container.register<IPasswordService>(TYPES.PasswordService, { useClass: PasswordService,});
        container.register<IEmailService>(TYPES.EmailService,{useClass:EmailService})
        container.register<IJwtService>(TYPES.JwtService,{useClass:JwtService})
        container.register<IAuthAdminService>(TYPES.AuthAdminService,{useClass:AuthAdminService})
        container.register<ITokenservice>(TYPES.TokenService,{useClass:TokenService})


        

    }
}