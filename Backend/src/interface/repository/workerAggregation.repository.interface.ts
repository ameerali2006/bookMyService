import { IWorker } from "../model/worker.model.interface";

export interface IWorkerAggregation{
    findNearbyWorkers(lat: number, lng: number, maxDistance: number):Promise<{_id:string,workers:IWorker[]}[]>
}