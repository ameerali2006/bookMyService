import { ProfileDetails } from "../../../dto/user/auth/profile.dto";

export interface IUpdateUserDetails{
    execute(user:Partial<ProfileDetails>,userId:string):Promise<{success:boolean,message:string,user:ProfileDetails|null}>
}