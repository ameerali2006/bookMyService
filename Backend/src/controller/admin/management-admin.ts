import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../../dto/shared/login.dto";
import {IAdminManagementController} from '../../interface/controller/management-admin.controller.interface'
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";
import { TYPES } from "../../config/constants/types";
import { inject, injectable } from "tsyringe";
import { IManagementAdminService } from "../../interface/service/managementAdmin.service.interface";
import { CustomError } from "../../utils/custom-error";



@injectable()
export class ManagementAdmin implements IAdminManagementController{
    constructor(
        @inject(TYPES.ManagementAdminService) private _adminManagement:IManagementAdminService
    ){

    }
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const users = await this._adminManagement.getAllUsers("user");
            res.status(STATUS_CODES.OK).json({success:true,users})
           
            
        } catch (error) {
            res.status(500).json({ message: "Failed to get users", error });
            next(error)

        }
    }
    async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.params,req.body)
            const userId=req.params.userId
            const status=req.body.isActive
            console.log(userId,status)
            const updated=await this._adminManagement.updateStatus(userId,status,"user")
            if(!updated){
                res.status(STATUS_CODES.BAD_REQUEST || 400).json({
                    success: false,
                    
                    message: `User updation failed`,
                });
            }
            res.status(STATUS_CODES.OK || 200).json({
                success: true,
                
                message: `User ${updated?.isBlocked? 'activated' : 'blocked'} successfully`,
            });
        } catch (error) {
            const statusCode = error instanceof CustomError ? error.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
            const message = error instanceof Error ? error.message : 'Failed to update user status';
            res.status(statusCode).json({
                success: false,
                message,
            });
            next(error);
            
        }
        
    }
    async getAllWorkers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const users = await this._adminManagement.getAllUsers("worker");
            res.status(STATUS_CODES.OK).json({success:true,users})
           
            
        } catch (error) {
            res.status(500).json({ message: "Failed to get users", error });
            next(error)

        }
    }
    async updateWorkerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.params,req.body)
            const userId=req.params.userId
            const status=req.body.isActive
            console.log(userId,status)
            const updated=await this._adminManagement.updateStatus(userId,status,"worker")
            if(!updated){
                res.status(STATUS_CODES.BAD_REQUEST || 400).json({
                    success: false,
                    
                    message: `User updation failed`,
                });
            }
            res.status(STATUS_CODES.OK || 200).json({
                success: true,
                
                message: `User ${updated?.isBlocked? 'activated' : 'blocked'} successfully`,
            });
        } catch (error) {
            const statusCode = error instanceof CustomError ? error.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
            const message = error instanceof Error ? error.message : 'Failed to update user status';
            res.status(statusCode).json({
                success: false,
                message,
            });
            next(error);
            
        }
    }
    async verifyWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {userId}=req.params
            const {isVerified} =req.body

            if(!userId||!isVerified){
                res.status(STATUS_CODES.BAD_REQUEST || 400).json({
                    success: false,
                    
                    message: MESSAGES.INVALID_CREDENTIALS,
                });
            }
            const verifiedWorker=await this._adminManagement.verifyWorker(userId,isVerified)
            if(!verifiedWorker){
                res.status(STATUS_CODES.BAD_REQUEST || 400).json({
                    success: false,
                    
                    message: MESSAGES.INVALID_CREDENTIALS,
                });
            }
            res.status(STATUS_CODES.OK || 200).json({
                success: true,
                
                message: `User verification updated successfully`,
            });


        } catch (error) {
            next(error)
        }
    }

}