import { serviceCreateDto } from "../../../dto/admin/management.dto";

export interface IGetServices{
    execute(lat:number,lng:number,maxDistance:number):Promise<{status:number,success:boolean,message:string,services?: serviceCreateDto[]}>
}