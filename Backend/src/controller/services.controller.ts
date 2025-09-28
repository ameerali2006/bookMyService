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
        const { lat, lng, maxDistance = 2000000 } = req.query;

        const response = await this._getService.execute(
          parseFloat(lat as string),
          parseFloat(lng as string),
          parseFloat(maxDistance as string)
        );
        console.log(response)

        res.status(response.status).json(response);
      } catch (error) {
        next(error)
      }
    }
}