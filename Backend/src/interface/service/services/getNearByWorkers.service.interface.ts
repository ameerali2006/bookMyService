import { IWorker } from "../../model/worker.model.interface";

export interface IGetNearByWorkers{
    execute(
    serviceId: string,
    lat: number,
    lng: number,
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ):Promise<{success:boolean,message:string,data:{workers:IWorker[],totalCount:number}|null}>
}