import { Request, Response, NextFunction } from "express";
import { IWorkingDetailsController } from "../../interface/controller/working-details.controller.interface";
import { TYPES } from "../../config/constants/types";
import { inject, injectable } from "tsyringe";
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";
import { CustomError } from "../../utils/custom-error";
import { IWorkingDetailsManagement } from "../../interface/service/worker/workingDetails.service.interface";

@injectable()
export class WorkingDetailsController implements IWorkingDetailsController{
    constructor(
        @inject(TYPES.WorkingDetailsManagement) private _workingManage:IWorkingDetailsManagement
    ){}
    async getWorkingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const email=req.query.email as string
            console.log(email)
            const details= await this._workingManage.getWorkingDetails(email)
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
            const details= await this._workingManage.updateWorkingDetails(email,payload)
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