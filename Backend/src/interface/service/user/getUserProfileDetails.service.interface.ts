import { ProfileDetails } from "../../../dto/user/auth/profile.dto";

export interface IGetUserProfileDetails{
    execute(userId:string):Promise<{success:boolean,message:string,user:ProfileDetails|null}>
}