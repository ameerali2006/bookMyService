import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../../dto/shared/login.dto";
import {IAdminManagementController} from '../../interface/controller/management-admin.controller.interface'
import { STATUS_CODES } from "../../config/constants/status-code";
import { MESSAGES } from "../../config/constants/message";
import { TYPES } from "../../config/constants/types";
import { inject, injectable } from "tsyringe";
import { IManagementAdminService } from "../../interface/service/managementAdmin.service.interface";
import { CustomError } from "../../utils/custom-error";
import { serviceRegistrationSchema } from "../validation/serviceCreate";



@injectable()
export class ManagementAdmin implements IAdminManagementController{
    constructor(
        @inject(TYPES.ManagementAdminService) private _adminManagement:IManagementAdminService
    ){

    }
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";
            const sortBy = (req.query.sortBy as string) || "createdAt";
            const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
            
            const data = await this._adminManagement.getAllUsers("user",page,limit,search,sortBy,sortOrder);
            console.log(data)
            res.status(STATUS_CODES.OK).json({success:true,...data})
           
            
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
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";
            const sortBy = (req.query.sortBy as string) || "createdAt";
            const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
            
            const data = await this._adminManagement.getAllUsers("worker",page,limit,search,sortBy,sortOrder);
            console.log(data)
            res.status(STATUS_CODES.OK).json({success:true,...data})
           
            
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
    async unVerifiedWorkers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("unverified controller")
            const {page=1, pageSize=10} = req.query
            const data = await this._adminManagement.getUnverifiedWorkers(Number(page),Number(pageSize),"pending")
            
            res.status(STATUS_CODES.OK).json({success:true,...data})
            
        } catch (error) {
            throw error instanceof CustomError ? error : new CustomError(
                'Failed to unverified workers',
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
    }
    async verifyWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.params)
            const { workerId } = req.params;
            const { status } = req.body;
            console.log({ workerId })

            if (!["approved", "rejected"].includes(status)) {
            res.status(400).json({ success: false, message: "Invalid status" });
            }
            console.log("kjhdk")
            const worker = await this._adminManagement.verifyWorker(workerId, status as "approved" | "rejected");

            res.json({ success: true, status: worker.status });

        } catch (error) {
            next(error)
        }
    }
    async getAllServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {search="",sort="latest",page="1",limit="6"}=req.query as {
            search?: string;
            sort?: string;
            page?: string;
            limit?: string;
            };
            const data=await this._adminManagement.getAllServices(String(search),sort,Number(page),Number(limit))
             res.status(STATUS_CODES.OK).json({ success: true, ...data});

        } catch (error) {
            next(error)
        }
    }
    async serviceRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data=req.body
            console.log(req)
            const validatedData=serviceRegistrationSchema.parse(data)
            const result=await this._adminManagement.serviceRegister(validatedData)
            if(result.data){
                res.status(STATUS_CODES.OK).json(result)
            }else{
                res.status(STATUS_CODES.NOT_FOUND).json(result)
            }
        } catch (error) {
            console.error(error)
            next(error)
        }
    }
    async  updateServiceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.params,req.body)
            const serviceId=req.params.id
            const status=req.body.status as "active" | "inactive"
            console.log(serviceId,status)
            const updated=await this._adminManagement.updateServiceStatus(serviceId,status)
            if(!updated){
                res.status(STATUS_CODES.BAD_REQUEST || 400).json({
                    success: false,
                    
                    message: `User updation failed`,
                });
            }
            res.status(STATUS_CODES.OK || 200).json({
                success: true,
                status:updated.status,
                message: `User ${updated?.status? "inactive" : "active"} successfully`,
            });
        } catch (error) {
            
        }
    }

}