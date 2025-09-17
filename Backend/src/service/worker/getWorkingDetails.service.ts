import { inject, injectable } from "tsyringe";
import { IWorkingDetails, IWorkingDetailsDocument } from "../../interface/model/working-details.interface";
import { IGetWorkingDetails } from "../../interface/service/worker/getWorkingDetails.service.interface";
import { TYPES } from "../../config/constants/types";
import { IWorkingDetailsRepository } from "../../interface/repository/working-details.interface";
import { Types } from "mongoose";
import { CustomError } from "../../utils/custom-error";
import { MESSAGES } from "../../config/constants/message";
import { STATUS_CODES } from "../../config/constants/status-code";
import { IWorkerRepository } from "../../interface/repository/worker.repository.interface";
@injectable()
export class GetWorkingDetails implements IGetWorkingDetails{
    constructor(
        @inject(TYPES.WorkingDetailsRepository) private _workingRepo:IWorkingDetailsRepository,
        @inject(TYPES.WorkerRepository) private _workerRepo:IWorkerRepository,
    ){}
    async execute(email: string): Promise<IWorkingDetailsDocument> {
        try {
            console.log(email)

            const worker=await this._workerRepo.findByEmail(email)
            console.log(worker)

            if(!worker){
                throw new CustomError('worker is not found',STATUS_CODES.BAD_REQUEST)
            }
            const workerId=worker._id.toString()
            let details = await this._workingRepo.findByWorkerId(workerId)
            if(!details){
                const defaultDays =
                ["Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday", 
                "Saturday",
                "Sunday",
                ].map((day) => ({
                day,
                enabled: false,
                startTime: new Date("1970-01-01T09:00:00Z"),
                endTime: new Date("1970-01-01T17:00:00Z"),
                breaks: [],
                }));

                details = await this._workingRepo.create({
                workerId :new Types.ObjectId(workerId),
                status: "active",
                maxAppointmentsPerDay: null,
                breakEnforced: true,
                weekStartDay: "Monday",
                defaultSlotDuration: 60,
                autoAcceptBookings: false,
                notes: "",
                days: defaultDays,
                holidays: [],
                customSlots: [],
                }as unknown as Partial<IWorkingDetailsDocument>);
            }
            return details
            
        } catch (error) {
            throw new CustomError(MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            
        }
        
    }
}