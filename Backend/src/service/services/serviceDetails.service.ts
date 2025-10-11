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
@injectable()
export class ServiceDetails implements IServiceDetails {
    constructor(
        @inject(TYPES.WorkerAggregation) private _workerAgg: IWorkerAggregation,
        @inject(TYPES.ServiceRepository) private _serviceRepo: IServiceRepository,
        @inject(TYPES.WorkingDetailsRepository) private _workingDetails: IWorkingDetailsRepository,
        @inject(TYPES.BookingRepository) private _booking: IBookingRepository
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
        const working = await this._workingDetails.findByWorkerId(workerId);
        if (!working) {
            return {
            status: 404,
            success: false,
            message: "Working details not found",
            };
        }

        const today = new Date();
        const todayName = today.toLocaleString("en-US", { weekday: "long" });
        const rotatedDays = this.rotateDays(working.days, todayName);

        const results: any[] = [];

        for (let i = 0; i < 7; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            const dateStr = targetDate.toISOString().split("T")[0];
            const daySchedule = rotatedDays[i];

            const isHoliday = working.holidays.some(
            (h) => h.date.toDateString() === targetDate.toDateString()
            );

            const availableTimes: {
            start: string;
            end: string;
            status: "available" | "unavailable" | "break" | "booked";
            }[] = [];

            if (isHoliday || !daySchedule || !daySchedule.enabled) {
            availableTimes.push({
                start: "00:00",
                end: "24:00",
                status: "unavailable",
            });
            } else {
            availableTimes.push({
                start: daySchedule.startTime,
                end: daySchedule.endTime,
                status: "available",
            });

            for (const br of daySchedule.breaks || []) {
                availableTimes.push({
                start: br.breakStart,
                end: br.breakEnd,
                status: "break",
                });
            }

            const customSlots = (working.customSlots || []).filter(
                (cs) => cs.date.toDateString() === targetDate.toDateString()
            );
            for (const cs of customSlots) {
                availableTimes.push({
                start: cs.startTime,
                end:cs.endTime,
                status: "available",
                });
            }

            const startHM = daySchedule.startTime;
            const endHM = daySchedule.endTime;
            availableTimes.push({
                start: "00:00",
                end: startHM,
                status: "unavailable",
            });
            availableTimes.push({
                start: endHM,
                end: "24:00",
                status: "unavailable",
            });
            }

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

            availableTimes.sort(
            (a, b) => this.timeToMinutes(a.start) - this.timeToMinutes(b.start)
            );

            results.push({
            date: dateStr,
            day:
                daySchedule?.day ||
                targetDate.toLocaleString("en-US", { weekday: "long" }),
            enabled: !!daySchedule?.enabled && !isHoliday,
            availableTimes,
            });
        }
        console.log(...results);

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
