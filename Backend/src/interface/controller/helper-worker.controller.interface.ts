import { Request, Response, NextFunction } from "express";

export interface ICloudinaryController {

  getSignature(req: Request, res: Response, next: NextFunction):  Promise<Response | void>;
  
}
