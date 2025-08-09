export interface IResetPassword{
    forgotPassword(email:string,role:"worker"|"user"): Promise<void>;
    resetPassword(token:string,password:string,role:"worker"|"user"):Promise<void>
    
}