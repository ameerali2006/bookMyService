import { container } from "tsyringe";

import { IUserRepository } from "../../interface/repository/user.repository.interface";
import { UserRepository } from "../../repository/user/user.repository";
import {TYPES} from '../../config/constants/types';
import { OtpRepository } from "../../repository/shared/otp-repository.reposiory";
import { IOtpRepository } from "../../interface/repository/otp.repository.interface";
import { IAdminRepository } from "../../interface/repository/admin.repository.interface";
import { AdminRepository } from "../../repository/admin/admin.repository";
import {IRedisTokenRepository} from '../../interface/repository/redis/redis.repository.interface';
import {RedisTokenRepository} from "../../repository/shared/redis.repository";
import {RefreshTokenRepository} from "../../repository/shared/refresh-token.repository"
import {IRefreshTokenRepository} from "../../interface/repository/refresh-token.repository.interface"
// Make sure this class is decorated with @injectable()



export class RepositoryRegistery{
    static registerRepository ():void{
        container.register<IUserRepository>(TYPES.AuthUserRepository, { useClass :UserRepository });
        container.register<IOtpRepository>(TYPES.OtpRepository, {useClass:OtpRepository})
        container.register<IAdminRepository>(TYPES.AdminRepository,{ useClass: AdminRepository });
        container.register<IRedisTokenRepository>(TYPES.RedisTokenRepository,{useClass:RedisTokenRepository})
        container.register<IRefreshTokenRepository>(TYPES.RefreshTokenRepository,{useClass:RefreshTokenRepository})

        

    }
}