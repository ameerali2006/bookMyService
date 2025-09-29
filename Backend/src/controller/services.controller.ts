import { NextFunction, Request, Response } from "express";
import { IServiceConroller } from "../interface/controller/services.controller.interface";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../config/constants/types";
import { IGetServices } from "../interface/service/services/getServices.service.interface";
import { STATUS_CODES } from "../config/constants/status-code";
import { IGetNearByWorkers } from "../interface/service/services/getNearByWorkers.service.interface";
@injectable()
export class ServiceController implements IServiceConroller{
    constructor(
        @inject(TYPES.GetService) private _getService:IGetServices,
        @inject(TYPES.GetNearByWorkers) private _getNearWorker:IGetNearByWorkers,
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
    async getNearByWorkers(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
      const {
        search = "",
        sort = "asc",
        page = 1,
        pageSize = 10,
        serviceId,
        lat,
        lng,
      } = req.query;

      const response = await this._getNearWorker.execute(
        serviceId as string,
        Number(lat),
        Number(lng),
        search as string,
        sort as string,
        Number(page),
        Number(pageSize)
      );

      if(response.success){
        res.status(STATUS_CODES.OK).json({
          success: true,
          message: response.message,
          workers:response.data?.workers,
          totalCount:response.data?.totalCount,
          totalPages: Math.ceil(response.data?.totalCount as number / Number(pageSize)),
          currentPage: Number(page),
        });
      }
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: response.message || "Failed to fetch nearby workers",
      });
    } catch (error: any) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: error.message || "Failed to fetch nearby workers",
      });
    }
    }
    
}