export interface userManageDto{
    _id:string,
    name:string,
    email:string,
    phone:string,
    image?:string,
    isBlocked:boolean,
    createdAt:Date

}
export interface workerManageDto {
  _id: string
  name: string
  email: string
  phone?: string
  isBlocked: boolean
  isVerified: boolean
  category: string
  experience: string
  profileImage?: string
  createdAt: Date
}