import { NextFunction, Request, Response } from 'express';

export interface IUserController{
    userProfileDetails(req:Request, res:Response, next:NextFunction):Promise<void>
    updateProfileDetails(req:Request, res:Response, next:NextFunction):Promise<void>
    getUserAddresses(req:Request, res:Response, next:NextFunction):Promise<void>
    addUserAddress(req:Request, res:Response, next:NextFunction):Promise<void>
    setPrimaryAddress(req:Request, res:Response, next:NextFunction):Promise<void>
    changePassword(req:Request, res:Response, next:NextFunction):Promise<void>

}
