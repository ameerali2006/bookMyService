import { Request, Response, NextFunction } from "express";
import { IWorkingDetailsController } from "../../interface/controller/working-details.controller.interface";
import { TYPES } from "../../config/constants/types";
import { IGetWorkingDetails } from "../../interface/service/worker/getWorkingDetails.service.interface";
import { inject, injectable } from "tsyringe";
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";
import { CustomError } from "../../utils/custom-error";
@injectable()
export class WorkingDetailsController implements IWorkingDetailsController{
    constructor(
        @inject(TYPES.GetWorkingDetails) private _getWorkingDetails:IGetWorkingDetails
    ){}
    async getWorkingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email=req.query.email as string
            console.log(email)
            const details= await this._getWorkingDetails.execute(email)
            if(details){
                res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.DATA_SENT_SUCCESS,data:details})
            }else{
                res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.FORBIDDEN,data:null})
            }
        } catch (error) {
            next(error)
        }


    }
}