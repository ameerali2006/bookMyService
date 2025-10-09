import { inject, injectable } from "tsyringe";
import { ProfileDetails } from "../../dto/user/auth/profile.dto";
import { IProfileManagement } from "../../interface/service/user/profileManagement.serice.interface";
import { UserMapper } from "../../utils/mapper/user-mapper";
import { TYPES } from "../../config/constants/types";
import { IUserRepository } from "../../interface/repository/user.repository.interface";
@injectable()
export class ProfileManagement implements IProfileManagement {
    constructor(
        @inject(TYPES.AuthUserRepository) private _userRepo:IUserRepository,
    ) {}

    async getUserProfileDetails(userId: string): Promise<{
        success: boolean;
        message: string;
        user: ProfileDetails | null;
    }> {
        try {
        console.log("user service");
        console.log(userId);
        if (!userId) {
            return {
            success: false,
            message: "user is Not fount",
            user: null,
            };
        }
        console.log("get Profile Details", userId);
        const userData = await this._userRepo.findById(userId);
        if (!userData) {
            return {
            success: false,
            message: "User is Not fount",
            user: null,
            };
        }
        const user = UserMapper.responseuserProfileDetails(userData);
        console.log("user service", user);
        return {
            success: true,
            message: "user data fetch successfully",
            user,
        };
        } catch (error) {
        return {
            success: false,
            message: "Bad request",
            user: null,
        };
        }
    }
    async updateUserProfileDetails(
        user: Partial<ProfileDetails>,
        userId: string
    ): Promise<{
        success: boolean;
        message: string;
        user: ProfileDetails | null;
    }> {
        try {
        if (!user || Object.keys(user).length === 0) {
            return { success: false, message: "User data is missing", user: null };
        }

        if (!userId) {
            return { success: false, message: "User ID is missing", user: null };
        }

        const userData = await this._userRepo.updateById(userId, user);

        if (!userData) {
            return { success: false, message: "User not found", user: null };
        }

        const updatedUser = UserMapper.responseuserProfileDetails(userData);

        return {
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        };
        } catch (error: any) {
            console.error("Error updating user:", error.message || error);
            return { success: false, message: "Internal server error", user: null };
        }
    }
}
