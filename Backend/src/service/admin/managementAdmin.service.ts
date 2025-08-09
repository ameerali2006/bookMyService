import {inject,injectable} from 'tsyringe'
import { IManagementAdminService } from '../../interface/service/managementAdmin.service.interface';
import { IUser } from '../../interface/model/user.model.interface';
import { TYPES } from '../../config/constants/types';
import { IUserRepository } from '../../interface/repository/user.repository.interface';
import { userManageDto, workerManageDto } from '../../dto/admin/management.dto';
import { AdminMapper } from '../../utils/mapper/admin-mapper';
import { CustomError } from '../../utils/custom-error';
import { MESSAGES } from '../../config/constants/message';
import { STATUS_CODES } from '../../config/constants/status-code';
import { IWorkerRepository } from '../../interface/repository/worker.repository.interface';
import { IWorker } from '../../interface/model/worker.model.interface';


@injectable()
export class ManagementAdminService implements IManagementAdminService{
    constructor(
        @inject(TYPES.AuthUserRepository) private _userRepo:IUserRepository,
        @inject(TYPES.WorkerRepository) private _workerRepo:IWorkerRepository
    ) {
        
    }
    async getAllUsers<T extends "user"|"worker">(role:T): Promise<userManageDto[]|workerManageDto[]> {
        
        try {
            const users= role=="user"? await this._userRepo.findAll():await this._workerRepo.findAll()
            let userDataDto
            if (role === "user") {
                userDataDto = AdminMapper.resUserDetails(users as IUser[]); 
            } else {
                userDataDto = AdminMapper.resWorkersDetails(users as IWorker[]);
            }
            return userDataDto
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
    async verifyWorker(userId: string, isVerified: boolean): Promise<IWorker | null> {
        try {
            if(!userId||typeof isVerified != "boolean"){
                throw new CustomError(
                MESSAGES.INVALID_CREDENTIALS || 'User ID is required or status is needed',
                STATUS_CODES.BAD_REQUEST
                );
            }
            const verifiedWorker=await this._workerRepo.updateById(userId,{isVerified})
            if(!verifiedWorker){
                throw new CustomError(
                MESSAGES.USER_NOT_FOUND || 'User ID not found',
                STATUS_CODES.BAD_REQUEST
                );
            }
            return verifiedWorker
        } catch (error) {
            
            throw error instanceof CustomError ? error : new CustomError(
                'Failed toverify worker status',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
    }

}