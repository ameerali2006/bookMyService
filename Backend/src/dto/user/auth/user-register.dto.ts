export interface UserRegisterDTO {
  name: string;
  email: string;
  password?: string;
  phone?:string;
  googleId?:string
  
}
export interface userResponse{
  name:string;
  email:string;
  image?:string;
}
