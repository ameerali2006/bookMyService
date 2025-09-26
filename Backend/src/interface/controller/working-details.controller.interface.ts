import { NextFunction, Request, Response } from "express";

export interface IWorkingDetailsController{
    getWorkingDetails(req: Request, res: Response, next:NextFunction): Promise<void>;
    updateWorkingDetails(req: Request, res: Response, next:NextFunction): Promise<void>;
}