import { serviceCreateDto } from '../../../dto/admin/management.dto';
import { IWorker } from '../../model/worker.model.interface';

export interface IServiceDetails{
    getServices(lat:number, lng:number, maxDistance:number):Promise<{status:number, success:boolean, message:string, services?: serviceCreateDto[]}>
    getWorkerAvailablity(workerId: string): Promise<{
        status: number;
        success: boolean;
        message: string;
        data?: {
            dates: {
                date: string;
                enabled:boolean;
                day: string;
                availableTimes: {
                start: string;
                end: string;
                status: 'available' | 'unavailable' | 'break' | 'booked';
                }[];
            }[];
        };
    }>;
    getNearByWorkers(
        serviceId: string,
        lat: number,
        lng: number,
        search: string,
        sort: string,
        page: number,
        pageSize: number
      ):Promise<{success:boolean, message:string, data:{workers:IWorker[], totalCount:number}|null}>
}
