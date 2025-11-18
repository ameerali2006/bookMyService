import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { WorkerModel } from '../../model/worker.model';
import { BaseRepository } from '../shared/base.repository';
import { IWorker } from '../../interface/model/worker.model.interface';
import { IWorkerAggregation } from '../../interface/repository/workerAggregation.repository.interface';

@injectable()
export class WorkerAggregation
  extends BaseRepository<IWorker>
  implements IWorkerAggregation {
  constructor() {
    super(WorkerModel);
  }

  async findNearbyWorkers(lat: number, lng: number, maxDistance: number) {
    return WorkerModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance,
          spherical: true,
          query: { isVerified: 'approved' },
        },
      },
      {
        $group: {
          _id: '$category',
          workers: { $push: '$$ROOT' },
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
    pageSize: number,
    maxDistance: number = 200000, // default 20 km
  ): Promise<{ workers: IWorker[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const serviceObjectId = new Types.ObjectId(serviceId);

    const pipeline: any[] = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          spherical: true,
          maxDistance,
          query: {
            category: serviceObjectId,
            isVerified: 'approved',
            ...(search && { name: { $regex: search, $options: 'i' } }),
          },
        },
      },
      { $sort: sort === 'rating' ? { distance: 1 } : { distance: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ];

    const workers = await WorkerModel.aggregate(pipeline);

    const countPipeline: any[] = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          spherical: true,
          maxDistance,
          query: {
            category: serviceObjectId,
            isVerified: 'approved',
            ...(search && { name: { $regex: search, $options: 'i' } }),
          },
        },
      },
      { $count: 'totalCount' },
    ];

    const countResult = await WorkerModel.aggregate(countPipeline);
    const totalCount = countResult[0]?.totalCount || 0;

    return { workers, totalCount };
  }
}
