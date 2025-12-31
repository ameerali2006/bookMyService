import { serviceCreateDto } from '../../../dto/admin/management.dto';
import { getNearByWorkersResponseDto, getServicesResponseDto, getWorkerAvailablityResponseDto } from '../../../dto/service.dto';
import { IWorker } from '../../model/worker.model.interface';

export interface IServiceDetails{
    getServices(lat:number, lng:number, maxDistance:number):Promise<getServicesResponseDto>
    getWorkerAvailablity(workerId: string): Promise<getWorkerAvailablityResponseDto>;
    getNearByWorkers(
        serviceId: string,
        lat: number,
        lng: number,
        search: string,
        sort: string,
        page: number,
        pageSize: number
      ):Promise<getNearByWorkersResponseDto>
}
