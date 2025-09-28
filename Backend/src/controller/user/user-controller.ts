import { Request, Response, NextFunction } from "express";
import { IUserController } from "../../interface/controller/user-controller.controller.interface";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middleware/auth.middleware";
import { TYPES } from "../../config/constants/types";
import { IGetUserProfileDetails } from "../../interface/service/user/getUserProfileDetails.service.interface";
import { STATUS_CODES } from "../../config/constants/status-code";
import { IUpdateUserDetails } from "../../interface/service/user/updateUserProfileDatails.service.interface";
import { CustomError } from "../../utils/custom-error";
import { MESSAGES } from "../../config/constants/message";
@injectable()
export class UserController implements IUserController{
    constructor(
        @inject(TYPES.GetUserProfileDetails) private _getDetails:IGetUserProfileDetails,
        @inject(TYPES.UpdateUserDetails) private _updateProfile:IUpdateUserDetails,
    ) {}
    async userProfileDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            console.log((req as CustomRequest).user)
            const userId=(req as CustomRequest).user._id
            const data=await this._getDetails.execute(userId)
            
            res.status(STATUS_CODES.OK).json(data)

        } catch (error) {
            next(error)
        } 
    }
    async updateProfileDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user=req.body
            console.log(req.body)
            const userId=(req as CustomRequest).user._id

            const updatedData=await this._updateProfile.execute(user,userId)
            if(!updatedData){
                throw new CustomError(MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }
            res.status(STATUS_CODES.OK).json(updatedData)

           
        } catch (error) {
            next(error)
        }
    }

}