import { inject, injectable } from "tsyringe";
import { TYPES } from "../../config/constants/types";
import { IDaySchedule, IWorkingDetails, IWorkingDetailsDocument } from "../../interface/model/working-details.interface";
import { IWorkerRepository } from "../../interface/repository/worker.repository.interface";
import { IUpdateWorkingDetails } from "../../interface/service/worker/updateWorkerDetails.service.interface";
import { IWorkingDetailsRepository } from "../../interface/repository/working-details.interface";
import { MESSAGES } from "../../config/constants/message";
import { CustomError } from "../../utils/custom-error";
import { STATUS_CODES } from "../../config/constants/status-code";
import { IDateConversionService } from "../../interface/service/date-convertion.service.interface";
@injectable()
export class UpdateWorkingDetails implements IUpdateWorkingDetails{
    constructor(
        @inject(TYPES.WorkerRepository) private _workerRepo:IWorkerRepository,
        @inject(TYPES.WorkingDetailsRepository) private _workingRepo:IWorkingDetailsRepository,
         @inject(TYPES.DateConversionService) private _dateService: IDateConversionService
    ){}
    async execute(email: string, payload: IDaySchedule): Promise<{success:boolean,message:string,data:IWorkingDetailsDocument|null}> {
        try {
           const worker = await this._workerRepo.findByEmail(email);
            if (!worker) {
                return { success: false, message: MESSAGES.USER_NOT_FOUND, data: null };
            }

            
            const normalizedPayload: Partial<IDaySchedule> = {
                ...payload,
                startTime: this._dateService.istToUTC(new Date(payload.startTime)),
                endTime: this._dateService.istToUTC(new Date(payload.endTime)),
                breaks: payload.breaks?.map((b) => ({
                ...b,
                breakStart: this._dateService.istToUTC(new Date(b.breakStart)),
                breakEnd: this._dateService.istToUTC(new Date(b.breakEnd)),
                })) || [],
            };

            const details = await this._workingRepo.upsertByWorkerId(
                worker._id.toString(),
                normalizedPayload as Partial<IWorkingDetails>
            );

            if (!details) {
                return { success: false, message: MESSAGES.RESOURCE_NOT_FOUND, data: null };
            }

            return { success: true, message: MESSAGES.DATA_SENT_SUCCESS, data: details };
        } catch (error) {
            throw new CustomError(MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            
        }
    }
}