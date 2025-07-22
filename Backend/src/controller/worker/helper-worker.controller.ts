import { NextFunction, Request, Response } from "express";
import { ICloudinaryService } from "../../interface/helpers/cloudinary.service.interface";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../../config/constants/types";
import { ICloudinaryController } from "../../interface/controller/helper-worker.controller.interface";
@injectable()
export class CloudinaryController implements ICloudinaryController {
  constructor(
    @inject(TYPES.CloudinaryService) private  cloudinaryService: ICloudinaryService
) {}

    async getSignature(req: Request, res: Response, next: NextFunction) {
        try {
            const signatureData = this.cloudinaryService.generateSignature();
            return res.status(200).json(signatureData);
        } catch (err) {
            next(err);
        }
    }
}
