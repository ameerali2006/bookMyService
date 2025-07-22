import { IWorkerRepository} from "../../interface/repository/worker.repository.interface";
import { WorkerModel, IWorker } from "../../model/worker.model";
import { injectable } from "inversify";
import { BaseRepository } from "../../repository/shared/base.repository";

@injectable()
export class WorkerRepository 
  extends BaseRepository<IWorker>
  implements IWorkerRepository 
{
  constructor() {
    super(WorkerModel);
  }

  async findByEmail(email: string): Promise<IWorker | null> {
    return await WorkerModel.findOne({ email });
  }
}
