import {inject,injectable} from 'tsyringe'
import { IManagementAdminService } from '../../interface/service/managementAdmin.service.interface';
import { IUser } from '../../interface/model/user.model.interface';
import { TYPES } from '../../config/constants/types';
import { IUserRepository } from '../../interface/repository/user.repository.interface';
import { serviceCreateDto, serviceManageDto, userManageDto, workerManageDto } from '../../dto/admin/management.dto';
import { AdminMapper } from '../../utils/mapper/admin-mapper';
import { CustomError } from '../../utils/custom-error';
import { MESSAGES } from '../../config/constants/message';
import { STATUS_CODES } from '../../config/constants/status-code';
import { IWorkerRepository } from '../../interface/repository/worker.repository.interface';
import { IWorker } from '../../interface/model/worker.model.interface';
import { IServiceRepository } from '../../interface/repository/service.repository.interface';


@injectable()
export class ManagementAdminService implements IManagementAdminService{
    constructor(
        @inject(TYPES.AuthUserRepository) private _userRepo:IUserRepository,
        @inject(TYPES.WorkerRepository) private _workerRepo:IWorkerRepository,
        @inject(TYPES.ServiceRepository) private _serviceRepo:IServiceRepository,

    ) {
        
    }
    
    async getAllUsers(role: 'worker' | 'user', page: number, limit: number, search: string, sortBy: string, sortOrder: string): Promise<{ users: userManageDto[] | workerManageDto[]; currentPage: number; totalPages: number; totalItems: number; }>{
        
        try {
             const filter: any = {};

            if (search) {
                filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                ];
            }
  
            const skip = (page - 1) * limit;
            const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
            const { items, total } =
                role === "user"
                ? await this._userRepo.findAll(filter, skip, limit, sort)
                : await this._workerRepo.findAll(filter, skip, limit, sort);
            let userDataDto
            if (role === "user") {
                userDataDto = AdminMapper.resUserDetails(items as IUser[]); 
            } else {
                userDataDto = AdminMapper.resWorkersDetails(items as IWorker[]);
            }
            return {users:userDataDto,currentPage:page,totalPages:Math.ceil(total/limit),totalItems:total}
        } catch (error) {
            console.log(error)
            throw error instanceof CustomError ? error : new CustomError(
                MESSAGES.USER_NOT_FOUND || 'Failed to fetch users',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
            
        }
        

  
    }
    async updateStatus(userId: string, status: boolean,role:"worker"|"user"): Promise<IUser|IWorker|null> {
        try {
            if (!userId) {
                throw new CustomError(
                MESSAGES.INVALID_CREDENTIALS || 'User ID is required',
                STATUS_CODES.BAD_REQUEST
                );
            }

            if (typeof status !== 'boolean') {
                throw new CustomError(
                MESSAGES.INVALID_CREDENTIALS || 'isActive must be a boolean',
                STATUS_CODES.BAD_REQUEST
                );
            }
            const updated =role=="user"?await this._userRepo.updateById(userId,{isBlocked:status}):await this._workerRepo.updateById(userId,{isBlocked:status})
            if (!updated) {
                throw new CustomError(
                MESSAGES.USER_NOT_FOUND || 'User not found',
                STATUS_CODES.NOT_FOUND
                );
            }

            return updated;
            
        } catch (error) {
            throw error instanceof CustomError ? error : new CustomError(
                'Failed to update user status',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
            
        }
        
    }
    async getUnverifiedWorkers(page: number, pageSize: number, status: string): Promise<{ workers: IWorker[] | null; total: number; currentPage: number; totalPages: number; }> {
        try {
            const query: any = {};
            if (status) {
                query.isVerified = status; 
            }
            const {data,total}=await this._workerRepo.findWithPopulate(query,[{path:"category",select:"category"}],(page-1)*pageSize,pageSize)
            console.log({
                workers:data,
                total,
                currentPage:page,
                totalPages:Math.ceil(total/pageSize)
            })
            return {
                workers:data,
                total,
                currentPage:page,
                totalPages:Math.ceil(total/pageSize)
            }
        
        } catch (error) {
            console.error(error)
            throw error instanceof CustomError ? error : new CustomError(
                'data error',
                STATUS_CODES.BAD_REQUEST
            );
            
        }
    } 
    async verifyWorker(userId: string, status:"approved"|"rejected"): Promise<{status:"approved"|"rejected"}> {
        try {
            if(!userId){
                 throw new CustomError(
                MESSAGES.USER_NOT_FOUND || 'User ID not found',
                STATUS_CODES.BAD_REQUEST
                );
            }
            const verifiedWorker=await this._workerRepo.updateById(userId,{isVerified:status})
            console.log(verifiedWorker)
            if(!verifiedWorker){
                throw new CustomError(
                MESSAGES.USER_NOT_FOUND || 'User ID not found',
                STATUS_CODES.BAD_REQUEST
                );
            }
            return {status:verifiedWorker.isVerified as "approved" | "rejected"}
        } catch (error) {
            
            throw error instanceof CustomError ? error : new CustomError(
                'Failed to verify worker status',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
    }
    async getAllServices(search: string, sort: string, page: number, limit: number): Promise<{ services: serviceManageDto[]; currentPage: number; totalPages: number; totalItems: number; }> {
        try {
            const query:any={}
            if(search){
                query.category={$regex:search,$options:"i"}
            }
            let sortOption: any = { createdAt: -1 };
            if(sort=="lowPrice")sortOption={price:1}
            if(sort=="highPrice")sortOption={price:-1}

            const pageNumber = parseInt(String(page), 10) || 1;
            const pageSize = parseInt(String(limit), 10) || 6;
            const skip = (pageNumber - 1) * pageSize;

            const {items,total}=await this._serviceRepo.findAll(query,skip,limit,{...sortOption})

            const services=AdminMapper.resServiceDetails(items)
            console.log(services)
            return {
                services,
                currentPage:page,
                totalPages:Math.ceil(total/limit),
                totalItems:total
            }
        } catch (error) {
            console.log(error)
            throw error instanceof CustomError ? error : new CustomError(
                MESSAGES.USER_NOT_FOUND || 'Failed to fetch users',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
    }
    async serviceRegister(data: serviceCreateDto): Promise<{ data?: serviceManageDto; message: string; }> {
        try {

            const existing=await this._serviceRepo.findOne({category:data.category})

            if(existing){
                return { message: "Service already exists" };
            }
            
            const newService=await this._serviceRepo.create(data)
            const mappedData=AdminMapper.resServiceDetails([newService])
            return {
                data:mappedData[0],
                message:"Service created successfully"
            }
        } catch (error) {
            console.log(error)
            throw error instanceof CustomError ? error : new CustomError(
                MESSAGES.USER_NOT_FOUND || 'Failed to fetch users',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
            
        }
    }
    async updateServiceStatus(serviceId: string, status:'inactive' | 'active' ): Promise<{ success: boolean; status: 'inactive' | 'active'; }> {
        try {
            if (!serviceId) {
                throw new CustomError(
                    MESSAGES.INVALID_CREDENTIALS || 'User ID is required',
                    STATUS_CODES.BAD_REQUEST
                );     
            }
            
           

            const updated = await this._serviceRepo.updateById(serviceId, {
                status,
            });
            console.log(updated)

            if (!updated) {
                throw new CustomError(
                MESSAGES.ACCOUNT_NOT_VERIFIED || "Service not found",
                STATUS_CODES.NOT_FOUND
                );
            }

            return { success: true, status: updated.status };
        } catch (error) {

            console.log(error)
            throw error instanceof CustomError ? error : new CustomError(
                MESSAGES.USER_NOT_FOUND || 'Failed to fetch users',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }



            
    }

}