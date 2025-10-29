import {responseDto} from '../../dto/worker/auth/worker-register.dto';
import { WorkerProfileDTO } from '../../dto/worker/workingDetails.dto';
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
    static mapWorkerToProfileDTO = (worker: IWorker): WorkerProfileDTO => {
        return {
            id: worker._id?.toString(),
            name: worker.name,
            email: worker.email,
            phone: worker.phone||"",
            profileImage: worker.profileImage || "",
            experience: worker.experience,
            zone:worker.zone,           
            category: typeof worker.category === "object"
          ? (worker.category as any)?.category || ""
          : worker.category || "",
            fees: worker.fees,
            isActive: worker.isActive,
            isVerified: worker.isVerified,
            location: {
            lat: worker.location?.coordinates[1] || 0,
            lng: worker.location?.coordinates[0] || 0,
            },
            documents: worker.documents || "",
        };
    }
}
