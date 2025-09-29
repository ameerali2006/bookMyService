
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
   async findNearbyWorkersByServiceId(
    serviceId: string,
    lat: number,
    lng: number,
    search: string,
    sort: string,
    page: number,
    pageSize: number
  ):Promise<{workers:IWorker[],totalCount:number}> {

    const skip = (page - 1) * pageSize;

    const pipeline: any[] = [
      // Step 1: Match by service
      {
        $match: {
          serviceId,
          ...(search && {
            name: { $regex: search, $options: "i" },
          }),
        },
      },

      // Step 2: Calculate distance using Haversine formula
      {
        $addFields: {
          distance: {
            $multiply: [
              6371, // Earth radius in km
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
                        {
                          $cos: {
                            $subtract: [
                              { $degreesToRadians: "$location.lng" },
                              { $degreesToRadians: lng },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },

      // Step 3: Sort
      {
        $sort: sort === "asc" ? { distance: 1 } : { distance: -1 },
      },

      // Step 4: Pagination
      { $skip: skip },
      { $limit: pageSize },
    ];

    const workers = await WorkerModel.aggregate(pipeline);
    const totalCount = await WorkerModel.countDocuments({ serviceId });

    return { workers, totalCount };
  }
}