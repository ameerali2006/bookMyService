import { Request, Response, NextFunction } from "express";
import { IBookingController } from "../interface/controller/booking-controller.controller.interface";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../middleware/auth.middleware";
import { TYPES } from "../config/constants/types";
import { IBookingService } from "../interface/service/services/bookingService.sevice.interface";
import { STATUS_CODES } from "../config/constants/status-code";
@injectable()
export class BookingController implements IBookingController{
    constructor(
        @inject(TYPES.BookingService) private _bookingService:IBookingService,

    ) {}

    async setBasicBookingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId=(req as CustomRequest).user._id
            console.log(req.body)
            const {date,time,description,workerId}=req.body
            const response=await this._bookingService.setBasicBookingDetails(userId,workerId,time,date,description)
            if(!response.success){
                res.status(STATUS_CODES.BAD_REQUEST).json(response)
            }else{
                res.status(STATUS_CODES.OK).json(response)
            }



        } catch (error) {
            next(error)
        }
        
    }
}