export interface LoginDto{
    email:string,
    password:string
    role:"admin"|"worker"|"user"
}  