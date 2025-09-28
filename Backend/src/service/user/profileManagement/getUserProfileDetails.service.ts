import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../config/constants/types";
import { ProfileDetails } from "../../../dto/user/auth/profile.dto";
import { IUserRepository } from "../../../interface/repository/user.repository.interface";
import { IGetUserProfileDetails } from "../../../interface/service/user/getUserProfileDetails.service.interface";
import { UserMapper } from "../../../utils/mapper/user-mapper";
@injectable()
export class GetUserProfileDetails implements IGetUserProfileDetails{
    constructor(
        @inject(TYPES.AuthUserRepository) private userRepo:IUserRepository
    ) {}
    async execute(userId: string): Promise<{ success: boolean; message: string; user: ProfileDetails | null; }> {
        try {
             console.log("user service")
             console.log(userId)
            if(!userId){
                return {
                    success:false,
                    message:"user is Not fount",
                    user:null
                }
            }
            console.log("get Profile Details",userId)
            const userData=await this.userRepo.findById(userId)
            if(!userData){
                return {
                    success:false,
                    message:"User is Not fount",
                    user:null
                }
            }
            const user=UserMapper.responseuserProfileDetails(userData)
            console.log("user service",user)
            return {
                success:true,
                message:"user data fetch successfully",
                user,
            }
        } catch (error) {
            return {
                success:false,
                message:"Bad request",
                user:null
            }
        }
    }
}