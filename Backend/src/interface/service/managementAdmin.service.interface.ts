import {
  AdminBookingDto,
  serviceCreateDto, serviceManageDto, userManageDto, workerManageDto,
} from '../../dto/admin/management.dto';
import { IUser } from '../model/user.model.interface';
import { IWorker } from '../model/worker.model.interface';

export interface IManagementAdminService{

    getAllUsers(role:'worker'|'user', page:number, limit:number, search:string, sortBy:string, sortOrder:string): Promise<{users:userManageDto[]|workerManageDto[];currentPage: number;totalPages: number;totalItems: number}>;
    updateStatus(userId:string, status:boolean, role:'worker'|'user'):Promise<IUser|IWorker|null>
    verifyWorker(userId:string, status:'approved'|'rejected'):Promise<{status:'approved'|'rejected'}>
    getUnverifiedWorkers(page:number, pageSize:number, status:string):Promise<{workers:IWorker[]|null, total:number, currentPage:number, totalPages:number}>
    getAllServices(search:string, sort:string, page:number, limit:number,): Promise<{services:serviceManageDto[];currentPage: number;totalPages: number;totalItems: number}>;
    serviceRegister(data:serviceCreateDto):Promise<{data?:serviceManageDto, message:string}>
    updateServiceStatus(serviceId:string, status:'inactive' |'active'):Promise<{success:boolean, status:'inactive' |'active'}>
    getAllBookings(search:string,status:string,limit:number,page:number):Promise<{success:boolean,message:string,bookings?: AdminBookingDto[],total: number,page: number,limit: number}>
}
