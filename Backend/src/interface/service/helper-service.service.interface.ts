import { getServiceNamesResponse, getWorkerAvailableTimeResponse } from '../../dto/shared/helpers.dto';
import { IService } from '../model/service.model.interface';

export interface IWorkerHelperService{
    getServiceNames():Promise<getServiceNamesResponse[]|null>
    getWorkerAvailableTime(
        workerId: string, 
        date: Date, 
        startTime: string
    ): Promise<getWorkerAvailableTimeResponse> 
}
