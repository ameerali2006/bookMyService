import { NextFunction, Request, Response } from "express";

export interface IAdminController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>

}