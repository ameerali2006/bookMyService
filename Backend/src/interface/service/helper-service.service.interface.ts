import { IService } from '../model/service.model.interface';

export interface IWorkerHelperService{
    getServiceNames():Promise<{value:string, label:string}[]|null>
    getWorkerAvailableTime(
        workerId: string, 
        date: Date, 
        startTime: string
    ): Promise<{ success: boolean; availableTime?: string }> 
}
