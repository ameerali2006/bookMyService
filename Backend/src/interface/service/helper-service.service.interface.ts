import { IService } from '../model/service.model.interface';

export interface IWorkerHelperService{
    getServiceNames():Promise<{value:string, label:string}[]|null>
}
