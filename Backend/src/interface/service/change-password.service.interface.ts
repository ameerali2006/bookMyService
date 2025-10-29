import { ChangePasswordDTO } from "../../controller/validation/changePassword.zod";

export interface IChangePasswordService{
    changePassword(role: "worker" | "user", userId: string, dto: ChangePasswordDTO): Promise<{success:boolean,message:string}> 
}