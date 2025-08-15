import { inject , injectable } from "tsyringe";
import { IWorkerHelperService } from "../../interface/service/helper-service.service.interface";
import { IService } from "../../interface/model/service.model.interface";
import { TYPES } from "../../config/constants/types";
import { IServiceRepository } from "../../interface/repository/service.repository.interface";
import { CustomError } from "../../utils/custom-error";
import { MESSAGES } from "../../config/constants/message";
import { STATUS_CODES } from "../../config/constants/status-code";


@injectable()
export class WorkerHelperService implements IWorkerHelperService{
    constructor(
        @inject(TYPES.ServiceRepository) private _serviceRepo:IServiceRepository
    ) {
        
    }
    async getServiceNames(): Promise<{ value: string; label: string; }[] | null> {
        try {
            const data=await this._serviceRepo.findActiveServices()
            if(!data){
                return null
            }
            const finalData = data.map((dat, i) => {
                return {
                    value: String(dat._id),
                    label: dat.category.charAt(0).toUpperCase() + dat.category.slice(1)
                };
            });
            return finalData
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