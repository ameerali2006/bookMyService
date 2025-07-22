import { Request, Response, NextFunction } from "express";

export interface IWorkerAuthController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  generateOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
//   logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  
}
