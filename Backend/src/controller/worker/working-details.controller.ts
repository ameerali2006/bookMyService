import { Request, Response, NextFunction } from "express";
import { IWorkingDetailsController } from "../../interface/controller/working-details.controller.interface";
import { TYPES } from "../../config/constants/types";
import { IGetWorkingDetails } from "../../interface/service/worker/getWorkingDetails.service.interface";
import { inject, injectable } from "tsyringe";
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";
import { CustomError } from "../../utils/custom-error";
import { IUpdateWorkingDetails } from "../../interface/service/worker/updateWorkerDetails.service.interface";
@injectable()
export class WorkingDetailsController implements IWorkingDetailsController{
    constructor(
        @inject(TYPES.GetWorkingDetails) private _getWorkingDetails:IGetWorkingDetails,
        @inject(TYPES.UpdateWorkingDetails) private _updateWorkingDetails:IUpdateWorkingDetails
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
    async updateWorkingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email=req.body.email as string
            const payload=req.body.payload 
            console.log(email)
            const details= await this._updateWorkingDetails.execute(email,payload)
            if(details.success){
                res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.DATA_SENT_SUCCESS,data:details.data})
            }else{
                res.status(STATUS_CODES.BAD_REQUEST).json({success:false,message:MESSAGES.FORBIDDEN,data:null})
            }
        } catch (error) {
            next(error)
        }
    }
}