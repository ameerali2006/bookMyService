import { Request, Response, NextFunction } from "express";
import { IUserController } from "../../interface/controller/user-controller.controller.interface";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middleware/auth.middleware";
import { TYPES } from "../../config/constants/types";
import { STATUS_CODES } from "../../config/constants/status-code";

import { CustomError } from "../../utils/custom-error";
import { MESSAGES } from "../../config/constants/message";
import { updateUserProfileSchema } from "../validation/updateUserProfileDetails";
import { IProfileManagement } from "../../interface/service/user/profileManagement.serice.interface";
import { addressSchema } from "../validation/addAddress.zod";
import { changePasswordSchema } from "../validation/changePassword.zod";
import { IChangePasswordService } from "../../interface/service/change-password.service.interface";

@injectable()
export class UserController implements IUserController{
    constructor(
        @inject(TYPES.ProfileManagement) private _profileManage:IProfileManagement,
         @inject(TYPES.ChangePasswordService) private _changePassword:IChangePasswordService,
       
    ) {}
    async userProfileDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            console.log((req as CustomRequest).user)
            const userId=(req as CustomRequest).user._id
            const data=await this._profileManage.getUserProfileDetails(userId)
            
            res.status(STATUS_CODES.OK).json(data)

        } catch (error) {
            next(error)
        } 
    }
    async updateProfileDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body)

           const parsedData = updateUserProfileSchema.safeParse(req.body)

            if (!parsedData.success) {
            const errors = parsedData.error.format()
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                })
                throw new CustomError(MESSAGES.VALIDATION_ERROR,STATUS_CODES.CONFLICT)
            }

            const user = parsedData.data
            const userId=(req as CustomRequest).user._id

            const updatedData=await this._profileManage.updateUserProfileDetails(user,userId)
            if(!updatedData){
                throw new CustomError(MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }
            res.status(STATUS_CODES.OK).json(updatedData)

           
        } catch (error) {
            next(error)
        }
    }
    async getUserAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId=(req as CustomRequest).user._id
            console.log(userId)
            const data= await this._profileManage.getUserAddress(userId)
            console.log(data)
            res.status(STATUS_CODES.OK).json(data)
        } catch (error) {
            next(error)
        }
    }
    async addUserAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const userId=(req as CustomRequest).user._id
            
            const address=addressSchema.parse(req.body)
            const data=await this._profileManage.addUserAddress(userId,address)
            if(!data.success){
                res.status(STATUS_CODES.BAD_REQUEST).json(data)
            }else{
                res.status(STATUS_CODES.OK).json(data)
            }
            


        } catch (error) {
            next(error)
        }
    }
    async setPrimaryAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const userId=(req as CustomRequest).user._id
            console.log(req)
            const toSetId=req.body.toSetId
            console.log(userId+"+"+toSetId)
            const respose=await this._profileManage.setPrimaryAddress(userId,toSetId)
            if(!respose.success){
                res.status(STATUS_CODES.BAD_REQUEST).json(respose)
            }else{
                res.status(STATUS_CODES.OK).json(respose)
            }
        } catch (error) {
            next(error)
        }
    }
    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
         const parsed = changePasswordSchema.parse(req.body);
              const userId = (req as CustomRequest).user?._id;
              const result = await this._changePassword.changePassword("user", userId, parsed);
              if(result.success){
                res.status(STATUS_CODES.OK).json(result)
              }else{
                res.status(STATUS_CODES.CONFLICT).json(result)
                
              }
    }

}