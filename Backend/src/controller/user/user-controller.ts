import { Request, Response, NextFunction } from "express";
import { IUserController } from "../../interface/controller/user-controller.controller.interface";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middleware/auth.middleware";
import { TYPES } from "../../config/constants/types";
import { IProfileManagement } from "../../interface/service/user/profileManagement.service.interface";
@injectable()
export class UserController implements IUserController{
    constructor(
        @inject(TYPES.ProfileManagement) private profileService:IProfileManagement
    ) {}
    async userProfileDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("user Controller")
            console.log((req as CustomRequest).user)
            const userId=(req as CustomRequest).user._id
            const data=await this.profileService.getProfileDetails(userId)
             console.log("user Controller over",data)
            res.status(200).json(data)

        } catch (error) {
            next(error)
        } 
    }
}