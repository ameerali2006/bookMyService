import {JwtPayload} from 'jsonwebtoken';
import {inject,injectable} from 'tsyringe';
import {ITokenservice} from '../../interface/service/token.service.interface'
import {IJwtService} from '../../interface/helpers/jwt-service.service.interface'
import {IRedisTokenRepository} from '../../interface/repository/redis/redis.repository.interface';
import {TYPES} from '../../config/constants/types'
import { IRefreshTokenRepository } from '../../interface/repository/refresh-token.repository.interface';


@injectable()
export class TokenService implements ITokenservice{
    constructor(
        @inject(TYPES.RedisTokenRepository) private _redisTokenRepo:IRedisTokenRepository,
        @inject(TYPES.JwtService) private _jwtService:IJwtService,
        @inject(TYPES.RefreshTokenRepository)private _refreshTokenRepository: IRefreshTokenRepository

    ){}
    async blacklistToken(token: string): Promise<void> {
        const decode:string|JwtPayload|null=await this._jwtService.verifyToken(token,'access')
        if(!decode || typeof decode=="string"||!decode.exp){
            throw new Error("Invalid Token: Missing expiration time");
        }
        const expiresIn=decode.exp-Math.floor(Date.now()/100);
        if(expiresIn>0){
            await this._redisTokenRepo.blackListToken(token,expiresIn)
        }
    }
    async revokeRefreshToken(token: string): Promise<void> {
        await this._refreshTokenRepository.revokeRefreshToken(token);
    }

}