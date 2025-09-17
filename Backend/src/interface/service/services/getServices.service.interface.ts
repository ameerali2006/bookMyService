import { serviceCreateDto } from "../../../dto/admin/management.dto";

export interface IGetServices{
    execute():Promise<{services:serviceCreateDto[]}>
}