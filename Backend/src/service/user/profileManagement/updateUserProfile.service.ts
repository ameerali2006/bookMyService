import { inject, injectable } from "tsyringe";
import { TYPES } from "../../../config/constants/types";
import { ProfileDetails } from "../../../dto/user/auth/profile.dto";
import { IUserRepository } from "../../../interface/repository/user.repository.interface";
import { IUpdateUserDetails } from "../../../interface/service/user/updateUserProfileDatails.service.interface";
import { UserMapper } from "../../../utils/mapper/user-mapper";
@injectable()
export class UpdateUserDetails implements IUpdateUserDetails{

    constructor(
        @inject(TYPES.AuthUserRepository) private _userRepo:IUserRepository,

    ) {}
    async execute(
    user: Partial<ProfileDetails>,
    userId: string
    ): Promise<{ success: boolean; message: string; user: ProfileDetails | null }> {
    try {
        if (!user || Object.keys(user).length === 0) {
        return { success: false, message: "User data is missing", user: null }
        }

        if (!userId) {
        return { success: false, message: "User ID is missing", user: null }
        }

        const userData = await this._userRepo.updateById(userId, user)

        if (!userData) {
        return { success: false, message: "User not found", user: null }
        }

        const updatedUser = UserMapper.responseuserProfileDetails(userData)

        return {
        success: true,
        message: "User updated successfully",
        user: updatedUser,
        }
    } catch (error: any) {
        console.error("Error updating user:", error.message || error)
        return { success: false, message: "Internal server error", user: null }
    }
    }
}