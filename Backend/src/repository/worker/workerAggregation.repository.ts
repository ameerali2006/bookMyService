
import { WorkerModel } from "../../model/worker.model";
import { injectable } from "inversify";
import { BaseRepository } from "../shared/base.repository";
import { IWorker } from "../../interface/model/worker.model.interface";
import { IWorkerAggregation } from "../../interface/repository/workerAggregation.repository.interface";

@injectable()
export class WorkerAggregation
  extends BaseRepository<IWorker>
  implements IWorkerAggregation 
{
  constructor() {
    super(WorkerModel);
  }

  async findNearbyWorkers(lat: number, lng: number, maxDistance: number) {
    return WorkerModel.aggregate([
      {
        $addFields: {
          distance: {
            $multiply: [
              6371, 
              {
                $acos: {
                  $add: [
                    {
                      $multiply: [
                        { $sin: { $degreesToRadians: "$location.lat" } },
                        { $sin: { $degreesToRadians: lat } },
                      ],
                    },
                    {
                      $multiply: [
                        { $cos: { $degreesToRadians: "$location.lat" } },
                        { $cos: { $degreesToRadians: lat } },
                        { $cos: { $degreesToRadians: { $subtract: ["$location.lng", lng] } } },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      {
        $match: {
          distance: { $lte: maxDistance }, 
          
          isVerified: "approved",
        },
      },
      {
        $group: {
          _id: "$category",
          workers: { $push: "$$ROOT" },
        },
      },
    ]);
  }
}