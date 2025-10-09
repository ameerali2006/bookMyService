import { inject, injectable } from "tsyringe";
import {
  IDaySchedule,
  IWorkingDetails,
  IWorkingDetailsDocument,
  WeekDay,
} from "../../interface/model/working-details.interface";
import { IWorkingDetailsManagement } from "../../interface/service/worker/workingDetails.service.interface";
import { TYPES } from "../../config/constants/types";
import { IWorkingDetailsRepository } from "../../interface/repository/working-details.interface";
import { IWorkerRepository } from "../../interface/repository/worker.repository.interface";
import { IDateConversionService } from "../../interface/service/date-convertion.service.interface";
import {
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isSameDay,
} from "date-fns";
import { MESSAGES } from "../../config/constants/message";
import { CustomError } from "../../utils/custom-error";
import { STATUS_CODES } from "../../config/constants/status-code";
@injectable()
export class WorkingDetailsManagement implements IWorkingDetailsManagement {
  constructor(
    @inject(TYPES.WorkingDetailsRepository)
    private _workingRepo: IWorkingDetailsRepository,
    @inject(TYPES.WorkerRepository) private _workerRepo: IWorkerRepository,
    @inject(TYPES.DateConversionService)
    private _dateService: IDateConversionService
  ) {}
  async getWorkingDetails(email: string): Promise<IWorkingDetailsDocument> {
    try {
      const worker = await this._workerRepo.findByEmail(email);
      if (!worker) throw new Error("Worker not found");

      let details = await this._workingRepo.findByWorkerId(
        worker._id.toString()
      );
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // --- Helper to format Date to IST ---
      const toIST = (date: Date) => {
        const istOffset = 5.5 * 60 * 60 * 1000;
        return new Date(date.getTime() + istOffset);
      };

      if (!details) {
        // create default 9–5 days
        const today = new Date().getDay();
        const dayOrder = [
          ...daysOfWeek.slice(today),
          ...daysOfWeek.slice(0, today),
        ];

        const defaultDays = dayOrder.map((day, i) => {
          const baseDate = addDays(new Date(), i);
          const startTime = setMilliseconds(
            setSeconds(setMinutes(setHours(baseDate, 9), 0), 0),
            0
          );
          const endTime = setMilliseconds(
            setSeconds(setMinutes(setHours(baseDate, 17), 0), 0),
            0
          );

          return { day, enabled: false, startTime, endTime, breaks: [] };
        });

        details = await this._workingRepo.create({
          workerId: worker._id,
          status: "active",
          days: defaultDays,
          weekStartDay: dayOrder[0],
          breakEnforced: true,
          defaultSlotDuration: 60,
          autoAcceptBookings: false,
          notes: "",
          holidays: [],
          customSlots: [],
        } as unknown as Partial<IWorkingDetailsDocument>);
      } else if (daysOfWeek[new Date().getDay()] != details.weekStartDay) {
        // update day dates for next week
        const today = new Date();
        const getNextDayDate = (targetDayIndex: number, fromDate: Date) => {
          const diff = (targetDayIndex - fromDate.getDay() + 7) % 7;
          return addDays(fromDate, diff);
        };

        details.days = details.days.map((d) => {
          const dayIndex = daysOfWeek.indexOf(d.day);
          const nextDayDate = getNextDayDate(dayIndex, today);

          const startTime = setMilliseconds(
            setSeconds(setMinutes(setHours(nextDayDate, 9), 0), 0),
            0
          );
          const endTime = setMilliseconds(
            setSeconds(setMinutes(setHours(nextDayDate, 17), 0), 0),
            0
          );

          return { ...d, startTime, endTime, enabled: d.enabled ?? false };
        });
        details.weekStartDay = daysOfWeek[new Date().getDay()] as WeekDay;

        await details.save();
      }
      console.log("before convertion", details);

      // --- Convert all times to IST (return clean JSON) ---
      const plainDetails = details.toObject
        ? details.toObject()
        : { ...details };
      const convertedDays = (plainDetails.days as IDaySchedule[]).map((d) => ({
        ...d,
        startTime: this._dateService.formatIST(new Date(d.startTime)),
        endTime: this._dateService.formatIST(new Date(d.endTime)),
        breaks: (d.breaks || []).map((b) => ({
          ...b,
          startTime: this._dateService.formatIST(new Date(b.breakStart)),
          endTime: this._dateService.formatIST(new Date(b.breakEnd)),
        })),
      }));
      console.log("converted data", ...convertedDays);

      const result = { ...plainDetails, days: convertedDays };

      console.log("final response:", result);

      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateWorkingDetails(
    email: string,
    payload: IDaySchedule
  ): Promise<{
    success: boolean;
    message: string;
    data: IWorkingDetailsDocument | null;
  }> {
    try {
      const worker = await this._workerRepo.findByEmail(email);
      if (!worker) {
        return { success: false, message: MESSAGES.USER_NOT_FOUND, data: null };
      }

      const normalizedPayload: Partial<IDaySchedule> = {
        ...payload,
        startTime: this._dateService.istToUTC(new Date(payload.startTime)),
        endTime: this._dateService.istToUTC(new Date(payload.endTime)),
        breaks:
          payload.breaks?.map((b) => ({
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
        return {
          success: false,
          message: MESSAGES.RESOURCE_NOT_FOUND,
          data: null,
        };
      }

      return {
        success: true,
        message: MESSAGES.DATA_SENT_SUCCESS,
        data: details,
      };
    } catch (error) {
      throw new CustomError(MESSAGES.BAD_REQUEST, STATUS_CODES .BAD_REQUEST);
    }
  }
}
