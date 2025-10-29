import { Request, Response, NextFunction } from "express";
import { IWorkingDetailsController } from "../../interface/controller/working-details.controller.interface";
import { TYPES } from "../../config/constants/types";
import { inject, injectable } from "tsyringe";
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";
import { CustomError } from "../../utils/custom-error";
import { IWorkingDetailsManagement, updateWorker } from "../../interface/service/worker/workingDetails.service.interface";
import { CustomRequest } from "../../middleware/auth.middleware";
import { workerProfileUpdateSchema } from "../validation/updateWorkerprofile";
import { changePasswordSchema } from "../validation/changePassword.zod";
import { IChangePasswordService } from "../../interface/service/change-password.service.interface";

@injectable()
export class WorkingDetailsController implements IWorkingDetailsController {
  constructor(
    @inject(TYPES.WorkingDetailsManagement)
    private _workingManage: IWorkingDetailsManagement,
    @inject(TYPES.ChangePasswordService) private _changePassword:IChangePasswordService
  ) {}
  async getWorkingDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.query.email as string;
      console.log(email);
      const details = await this._workingManage.getWorkingDetails(email);
      if (details) {
        res
          .status(STATUS_CODES.OK)
          .json({
            success: true,
            message: MESSAGES.DATA_SENT_SUCCESS,
            data: details,
          });
      } else {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.FORBIDDEN, data: null });
      }
    } catch (error) {
      next(error);
    }
  }
  async updateWorkingDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = req.body.email as string;
      const payload = req.body.payload;
      console.log(email);
      const details = await this._workingManage.updateWorkingDetails(
        email,
        payload
      );
      if (details.success) {
        res
          .status(STATUS_CODES.OK)
          .json({
            success: true,
            message: MESSAGES.DATA_SENT_SUCCESS,
            data: details.data,
          });
      } else {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.FORBIDDEN, data: null });
      }
    } catch (error) {
      next(error);
    }
  }
  async getProfileDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const workerId = (req as CustomRequest).user._id;

      const response = await this._workingManage.getProfileDetails(workerId);
      console.log(response);
      if (response.success) {
        res.status(STATUS_CODES.OK).json(response);
      } else {
        res.status(STATUS_CODES.CONFLICT).json(response);
      }
    } catch (error) {
      next(error);
    }
  }
  async updateProfileDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const workerId = (req as CustomRequest).user._id;

      if (!workerId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.VALIDATION_ERROR,
        });
      }

      const parsed = workerProfileUpdateSchema.safeParse(req.body);

      if (!parsed.success) {
        const errors = parsed.error.format();
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }
      console.log(parsed.data)
      const response=await this._workingManage.updateWorkerProfile(workerId,parsed.data as updateWorker)
      console.log(response);
      if (response.success) {
        res.status(STATUS_CODES.OK).json(response);
      } else {
        res.status(STATUS_CODES.CONFLICT).json(response);
      }
    } catch (error) {
        next(error)
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
       const parsed = changePasswordSchema.parse(req.body);
      const userId = (req as CustomRequest).user?._id;
      const result = await this._changePassword.changePassword("worker", userId, parsed);
      if(result.success){
        res.status(STATUS_CODES.OK).json(result)
      }else{
        res.status(STATUS_CODES.CONFLICT).json(result)
        
      }

    } catch (error) {
      next(error)
    }
  }
}
 