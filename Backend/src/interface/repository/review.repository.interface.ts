// interface/repository/review.repository.interface.ts

import { IReview } from '../model/review.model.interface';
import { IBaseRepository } from './base.repository.interface';

export interface IReviewRepository extends IBaseRepository<IReview> {
  findByBookingId(bookingId: string): Promise<IReview | null>;
  findByWorkerId(
    workerId: string,
    page: number,
    limit: number
  ): Promise<IReview[]>;

  getWorkerRatingStats(workerId: string): Promise<{
    averageRating: number;
    totalReviews: number;
  }>;
}
