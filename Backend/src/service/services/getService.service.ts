import { inject, injectable } from "tsyringe";
import { MESSAGES } from "../../config/constants/message";
import { STATUS_CODES } from "../../config/constants/status-code";
import { TYPES } from "../../config/constants/types";
import { serviceCreateDto } from "../../dto/admin/management.dto";
import { IServiceRepository } from "../../interface/repository/service.repository.interface";
import { IGetServices } from "../../interface/service/services/getServices.service.interface";
import { CustomError } from "../../utils/custom-error";
@injectable()
export class GetServices implements IGetServices{
    constructor(
        @inject(TYPES.ServiceRepository) private _serviceRepo:IServiceRepository
    ) {}
    async execute(): Promise<{ services: serviceCreateDto[]; }> {
        try {
            const {items,total} =await this._serviceRepo.findAll({status:"active"})
            console.log(items)
            return {
                services:items
            }
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