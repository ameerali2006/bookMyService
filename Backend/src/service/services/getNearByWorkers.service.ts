import { inject, injectable } from "tsyringe";
import { IWorker } from "../../interface/model/worker.model.interface";
import { IGetNearByWorkers } from "../../interface/service/services/getNearByWorkers.service.interface";
import { TYPES } from "../../config/constants/types";
import { IWorkerAggregation } from "../../interface/repository/workerAggregation.repository.interface";
import { CustomError } from "../../utils/custom-error";
@injectable()

export class GetNearByWorkers implements IGetNearByWorkers{
    constructor(
        @inject(TYPES.WorkerAggregation) private _workerAgg:IWorkerAggregation,

    ) { 
        
    }
    async execute(serviceId: string, lat: number, lng: number, search: string, sort: string, page: number, pageSize: number): Promise<{ success: boolean; message: string; data: { workers: IWorker[]; totalCount: number; } | null; }> {
       try {
            if (!lat || !lng || !serviceId) {
                throw new Error("Latitude, longitude and serviceId are required");
            }

            const data= await this._workerAgg.findNearbyWorkersByServiceId(
                serviceId,
                lat,
                lng,
                search,
                sort,
                page,
                pageSize
            );
            console.log(data)
            if(!data){
                return {success:false,message:"Worker not Found",data:null}
            }
            return {success:true,message:"Data fetched Successfully",data}
       } catch (error) {
        console.error(error)
        return {success:false,message:"Worker not Found",data:null}
       }
    }
}