import { IWorker } from "../../model/worker.model";
import { IBaseRepository } from "./base.repository.interface";

export interface IWorkerRepository extends IBaseRepository<IWorker> {
  findByEmail(email: string): Promise<IWorker | null>;
  // Add more worker-specific repository methods if needed
}
