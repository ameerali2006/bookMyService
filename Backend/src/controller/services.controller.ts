import { NextFunction, Request, Response } from "express";
import { IServiceConroller } from "../interface/controller/services.controller.interface";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../config/constants/types";
import { IGetServices } from "../interface/service/services/getServices.service.interface";
import { STATUS_CODES } from "../config/constants/status-code";
@injectable()
export class ServiceController implements IServiceConroller{
    constructor(
        @inject(TYPES.GetService) private _getService:IGetServices,
    ){}
    async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
      const result = await this._getService.execute(); 
      console.log(result)

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        data: result.services,   // only send services
        message: "Fetched active services successfully",
      });
    } catch (error) {
      next(error)
    }
    }
}