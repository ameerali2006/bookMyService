import { NextFunction, Request, Response } from "express";

export interface IUserController{
    userProfileDetails(req:Request,res:Response,next:NextFunction):Promise<void>
    updateProfileDetails(req:Request,res:Response,next:NextFunction):Promise<void>
}