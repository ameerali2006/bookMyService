export interface ITokenservice{
    blacklistToken(token:string):Promise<void>
    revokeRefreshToken(token:string):Promise<void>
}