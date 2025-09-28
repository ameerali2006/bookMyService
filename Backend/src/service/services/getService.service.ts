import { inject, injectable } from "tsyringe";
import { MESSAGES } from "../../config/constants/message";
import { STATUS_CODES } from "../../config/constants/status-code";
import { TYPES } from "../../config/constants/types";
import { serviceCreateDto } from "../../dto/admin/management.dto";
import { IServiceRepository } from "../../interface/repository/service.repository.interface";
import { IGetServices } from "../../interface/service/services/getServices.service.interface";
import { CustomError } from "../../utils/custom-error";
import { IWorkerAggregation } from "../../interface/repository/workerAggregation.repository.interface";
@injectable()
export class GetServices implements IGetServices{
    constructor(
        @inject(TYPES.ServiceRepository) private _serviceRepo:IServiceRepository,
        @inject(TYPES.WorkerAggregation) private _workerAgg:IWorkerAggregation,
    ) {}
    async execute(lat:number,lng:number,maxDistance:number = 10): Promise<{status:number,success:boolean,message:string,services?: serviceCreateDto[]}> {
        try {
            if (!lat || !lng) {
                return {
                    status: STATUS_CODES.BAD_REQUEST,
                    success: false,
                    message: "Latitude and longitude are required",
                };
                
            }
            console.log({lat,lng,maxDistance})
            const nearbyWorkers = await this._workerAgg.findNearbyWorkers(lat, lng, maxDistance);
            console.log(nearbyWorkers)
            const serviceIds = nearbyWorkers.map((w) => w._id);

            if (serviceIds.length === 0) {
                return {
                    status: STATUS_CODES.OK,
                    success: true,
                    message: "No services found nearby",
                    services: [],
                };
            }

            const services = await this._serviceRepo.findActiveServicesByIds(serviceIds);

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
}