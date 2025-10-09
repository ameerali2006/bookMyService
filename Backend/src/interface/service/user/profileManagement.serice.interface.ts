import { ProfileDetails } from "../../../dto/user/auth/profile.dto";

export interface IProfileManagement{
    updateUserProfileDetails(user:Partial<ProfileDetails>,userId:string):Promise<{success:boolean,message:string,user:ProfileDetails|null}>
    getUserProfileDetails(userId:string):Promise<{success:boolean,message:string,user:ProfileDetails|null}>
}