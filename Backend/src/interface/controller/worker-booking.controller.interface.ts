import { NextFunction, Request, Response } from "express";

export interface IWorkerBookingController{
    approveService(req: Request, res: Response, next: NextFunction): Promise<void>
    rejectService(req: Request, res: Response, next: NextFunction): Promise<void>
}
