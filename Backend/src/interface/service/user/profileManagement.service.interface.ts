import { ProfileDetails } from "../../../dto/user/auth/profile.dto";

export interface IProfileManagement{
    getProfileDetails(userId:string):Promise<{success:boolean,message:string,user:ProfileDetails|null}>
}