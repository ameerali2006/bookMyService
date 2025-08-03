import {responseDto} from '../../dto/worker/auth/worker-register.dto';
import {IWorker} from '../../interface/model/worker.model.interface'


export class WorkerMapper{
    static responseWorkerDto(worker:IWorker):responseDto{
        return {
            name:worker.name,
            email:worker.email,
            image:worker?.profileImage
        }
    }
}