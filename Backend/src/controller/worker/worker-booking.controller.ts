import { inject, injectable } from 'tsyringe';
import { IWorkerBookingController } from '../../interface/controller/worker-booking.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../config/constants/types';
import { IWorkerBookingService } from '../../interface/service/worker/worker-booking.service.interface';
import { ApprovalSchema } from '../validation/serviceApproval.zod';
import { MESSAGES } from '../../config/constants/message';
import { STATUS_CODES } from '../../config/constants/status-code';
import { CustomRequest } from '../../middleware/auth.middleware';

@injectable()
export class WorkerBookingController implements IWorkerBookingController {
  constructor(
    @inject(TYPES.WorkerBookingService) private bookingService:IWorkerBookingService
  ) {}
  async approveService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = ApprovalSchema.parse(req.body);
      

      const result = await this.bookingService.approveService(data);
      console.log(result)

     if(result.success){
       res.status(STATUS_CODES.OK).json(result);
     }else{
       res.status(STATUS_CODES.BAD_REQUEST).json(result);
     }
    } catch (error) {
      next(error);
    } 
  }
  async rejectService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookingId, description } = req.body;

      const result = await this.bookingService.rejectService(
        bookingId,
        description
      );

      res.status(result.success?STATUS_CODES.OK:STATUS_CODES.BAD_REQUEST).json(result);

    } catch (error) {
      next(error);
    }
  }
  async getServiceRequests(req: Request, res: Response, next: NextFunction) :Promise<void>{
    try {
      const workerId = (req as CustomRequest).user._id; // from auth middleware

      const filters = {
        workerId,
        search: req.query.search?.toString() || "",
        status: (req.query.status as "pending"|"accepted"|"rejected") || "pending",
        date: req.query.date?.toString() || "",
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      };

      const response = await this.bookingService.getServiceRequests(filters);

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}