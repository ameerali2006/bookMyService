import { NextFunction, Request, Response } from "express";

export interface IAdminManagementController {
    
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>
    updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllWorkers(req: Request, res: Response, next: NextFunction): Promise<void>
    updateWorkerStatus(req: Request, res: Response, next: NextFunction): Promise<void>
    verifyWorker(req: Request, res: Response, next: NextFunction): Promise<void>
    unVerifiedWorkers(req: Request, res: Response, next: NextFunction): Promise<void>


}