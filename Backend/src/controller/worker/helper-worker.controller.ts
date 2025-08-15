import { NextFunction, Request, Response } from "express";
import { ICloudinaryService } from "../../interface/helpers/cloudinary.service.interface";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../../config/constants/types";
import { ICloudinaryController } from "../../interface/controller/helper-worker.controller.interface";
import { WorkerHelperService } from "../../service/worker/helper.service";
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";


@injectable()
export class CloudinaryController implements ICloudinaryController {
  constructor(
    @inject(TYPES.CloudinaryService) private  cloudinaryService: ICloudinaryService,
    @inject(TYPES.WorkerHelperService) private workerHelperService:WorkerHelperService ,

) {}

    async getSignature(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            const signatureData = this.cloudinaryService.generateSignature();
            res.status(200).json(signatureData);
        } catch (err) {
            next(err);
        }
    }
    async getServiceNames(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data =await  this.workerHelperService.getServiceNames()
            console.log(data)
            if(!data){
                res.status(STATUS_CODES.BAD_REQUEST).json({
					success: false,
					message: MESSAGES.RESOURCE_NOT_FOUND,
				});
            }
            res.status(STATUS_CODES.OK).json({success:true,message:MESSAGES.CREATED,data})
        } catch (error) {
            next(error);
        }
    }
}
