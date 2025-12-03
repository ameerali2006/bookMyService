import { inject, injectable } from 'tsyringe';
import { IWorkerBookingController } from '../../interface/controller/worker-booking.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../config/constants/types';
import { IWorkerBookingService } from '../../interface/service/worker/worker-booking.service.interface';
import { ApprovalSchema } from '../validation/serviceApproval.zod';
import { MESSAGES } from '../../config/constants/message';
import { STATUS_CODES } from '../../config/constants/status-code';

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
}