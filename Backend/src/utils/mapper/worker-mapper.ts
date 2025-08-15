import {responseDto} from '../../dto/worker/auth/worker-register.dto';
import {IWorker} from '../../interface/model/worker.model.interface'
import { WorkerModel} from '../../model/worker.model';


export class WorkerMapper{
    static responseWorkerDto(worker:IWorker):responseDto{
        return {
            name:worker.name,
            email:worker.email,
            image:worker?.profileImage
        }
    }
}