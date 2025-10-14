import { inject, injectable } from "tsyringe";
import { IWorker } from "../../interface/model/worker.model.interface";
import { IServiceDetails } from "../../interface/service/services/ServiceDetails.service.interface";
import { TYPES } from "../../config/constants/types";
import { IWorkerAggregation } from "../../interface/repository/workerAggregation.repository.interface";
import { serviceCreateDto } from "../../dto/admin/management.dto";
import { STATUS_CODES } from "../../config/constants/status-code";
import { CustomError } from "../../utils/custom-error";
import { MESSAGES } from "../../config/constants/message";
import { IServiceRepository } from "../../interface/repository/service.repository.interface";
import { IWorkingDetailsRepository } from "../../interface/repository/working-details.interface";
import { IBookingRepository } from "../../interface/repository/booking.repository.interface";
import { IWorkingHelper } from "../../interface/service/working-helper.service.interface";
import { IWorkingDetails } from "../../interface/model/working-details.interface";
@injectable()
export class ServiceDetails implements IServiceDetails {
    constructor(
        @inject(TYPES.WorkerAggregation) private _workerAgg: IWorkerAggregation,
        @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
        @inject(TYPES.WorkingDetailsRepository) private _workingDetails: IWorkingDetailsRepository,
        @inject(TYPES.BookingRepository) private _booking: IBookingRepository,
         @inject(TYPES.WorkingHelper) private _workingHelper: IWorkingHelper,
    ) {}
    async getNearByWorkers(
        serviceId: string,
        lat: number,
        lng: number,
        search: string,
        sort: string,
        page: number,
        pageSize: number
    ): Promise<{
        success: boolean;
        message: string;
        data: { workers: IWorker[]; totalCount: number } | null;
    }> {
        try {
        if (!lat || !lng || !serviceId) {
            throw new Error("Latitude, longitude and serviceId are required");
        }
        console.log({ serviceId, lat, lng, search, sort, page, pageSize });
        const data = await this._workerAgg.findNearbyWorkersByServiceId(
            serviceId,
            lat,
            lng,
            search,
            sort,
            page,
            pageSize
        );
        console.log(data);
        if (!data) {
            return { success: false, message: "Worker not Found", data: null };
        }
        return { success: true, message: "Data fetched Successfully", data };
        } catch (error) {
        console.error(error);
        return { success: false, message: "Worker not Found", data: null };
        }
    }
    async getServices(
        lat: number,
        lng: number,
        maxDistance: number
    ): Promise<{
        status: number;
        success: boolean;
        message: string;
        services?: serviceCreateDto[];
    }> {
        try {
        if (!lat || !lng) {
            return {
            status: STATUS_CODES.BAD_REQUEST,
            success: false,
            message: "Latitude and longitude are required",
            };
        }
        console.log({ lat, lng, maxDistance });
        const nearbyWorkers = await this._workerAgg.findNearbyWorkers(
            lat,
            lng,
            maxDistance
        );
        console.log(nearbyWorkers);
        const serviceIds = nearbyWorkers.map((w) => w._id);

        if (serviceIds.length === 0) {
            return {
            status: STATUS_CODES.OK,
            success: true,
            message: "No services found nearby",
            services: [],
            };
        }

        const services =
            await this._serviceRepo.findActiveServicesByIds(serviceIds);

        return {
            status: STATUS_CODES.OK,
            success: true,
            message: "Nearby services found",
            services,
        };
        } catch (error) {
        console.error("Login error:", error);

        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError(
            MESSAGES.UNAUTHORIZED_ACCESS,
            STATUS_CODES.INTERNAL_SERVER_ERROR
        );
        }
    }
    private rotateDays(days: any[], todayName: string) {
        const startIndex = days.findIndex((d) => d.day === todayName);
        if (startIndex === -1) return days;
        return [...days.slice(startIndex), ...days.slice(0, startIndex)];
    }

    private toHM(date: Date | string): string {
        const d = new Date(date);
        return d.toTimeString().substring(0, 5);
    }

    private timeToMinutes(time: string) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }
    async getWorkerAvailablity(
  workerId: string
): Promise<{
  status: number;
  success: boolean;
  message: string;
  data?: {
    dates: {
      date: string;
      enabled: boolean;
      day: string;
      availableTimes: {
        start: string;
        end: string;
        status: "available" | "unavailable" | "break" | "booked";
      }[];
    }[];
  };
}> {
  try {
    // 1️⃣ Fetch working details
    let details = await this._workingDetails.findByWorkerId(workerId);
    if (!details) {
      return {
        status: 404,
        success: false,
        message: "Working details not found",
      };
    }

    // 2️⃣ Check if rotation needed
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = daysOfWeek[new Date().getDay()];

    if (details.weekStartDay && todayName !== details.weekStartDay) {
      details = (await this._workingHelper.rotateDayShedule(
        String(details._id)
      )) as IWorkingDetails;
    }

    // 3️⃣ Use rotated (or original) day list
    const rotatedDays = details.days;
    const today = new Date();
    const results: any[] = [];

    // 4️⃣ Loop for next 7 days
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dateStr = targetDate.toISOString().split("T")[0];
      const daySchedule = rotatedDays[i];

      const isHoliday = details.holidays.some(
        (h) => h.date.toDateString() === targetDate.toDateString()
      );

      const availableTimes: {
        start: string;
        end: string;
        status: "available" | "unavailable" | "break" | "booked";
      }[] = [];

      // 5️⃣ Handle unavailable / normal workdays
      if (isHoliday || !daySchedule || !daySchedule.enabled) {
        availableTimes.push({
          start: "00:00",
          end: "24:00",
          status: "unavailable",
        });
      } else {
        // working time
        availableTimes.push({
          start: daySchedule.startTime,
          end: daySchedule.endTime,
          status: "available",
        });

        // breaks
        for (const br of daySchedule.breaks || []) {
          availableTimes.push({
            start: br.breakStart,
            end: br.breakEnd,
            status: "break",
          });
        }

        // custom slots (special availability)
        const customSlots = (details.customSlots || []).filter(
          (cs) => cs.date.toDateString() === targetDate.toDateString()
        );
        for (const cs of customSlots) {
          availableTimes.push({
            start: cs.startTime,
            end: cs.endTime,
            status: "available",
          });
        }

        // mark time outside work hours unavailable
        availableTimes.push(
          { start: "00:00", end: daySchedule.startTime, status: "unavailable" },
          { start: daySchedule.endTime, end: "24:00", status: "unavailable" }
        );
      }

      // 6️⃣ Mark booked slots
      const bookings = await this._booking.findByWorkerAndDate(
        workerId,
        targetDate
      );
      for (const b of bookings) {
        availableTimes.push({
          start: b.startTime,
          end: b.endTime || b.startTime,
          status: "booked",
        });
      }

      // 7️⃣ Sort time slots by start time
      availableTimes.sort(
        (a, b) => this.timeToMinutes(a.start) - this.timeToMinutes(b.start)
      );

      // 8️⃣ Push final result for this date
      results.push({
        date: dateStr,
        day:
          daySchedule?.day ||
          targetDate.toLocaleString("en-US", { weekday: "long" }),
        enabled: !!daySchedule?.enabled && !isHoliday,
        availableTimes,
      });
    }

    // 9️⃣ Return final data
    return {
      status: 200,
      success: true,
      message: "Availability fetched successfully",
      data: { dates: results },
    };
  } catch (error) {
    console.error("Error in GetWorkerAvailability:", error);
    return {
      status: 500,
      success: false,
      message: "Internal server error while fetching availability",
    };
  }
}

}
