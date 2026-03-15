// repository/review.repository.ts

import { Types } from "mongoose";

import { IReview } from "../../interface/model/review.model.interface";
import { IReviewRepository } from "../../interface/repository/review.repository.interface";
import { BaseRepository } from "./base.repository";
import { Review } from "../../model/review.model";
import { IReviewResponse } from "../../dto/user/worker-listing-home.dto";

export class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository
{
  constructor() {
    super(Review);
  }

  async findByBookingId(bookingId: string): Promise<IReview | null> {
    return Review.findOne({
      bookingId: new Types.ObjectId(bookingId),
    });
  }

  async findByWorkerId(
    workerId: string,
    page: number,
    limit: number,
  ): Promise<IReview[]> {
    const skip = (page - 1) * limit;

    return Review.find({
      workerId: new Types.ObjectId(workerId),
      isVisible: true,
    })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async getWorkerRatingStats(workerId: string): Promise<{
    averageRating: number;
    totalReviews: number;
  }> {
    const result = await Review.aggregate([
      {
        $match: {
          workerId: new Types.ObjectId(workerId),
          isVisible: true,
        },
      },
      {
        $group: {
          _id: "$workerId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (!result.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }

    return {
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews,
    };
  }
  async getRecentReviewsByWorker(workerId: string): Promise<IReviewResponse[]> {
    return Review.aggregate([
      {
        $match: {
          workerId: new Types.ObjectId(workerId),
          isVisible: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          userName: "$user.name",
        },
      },

      { $sort: { createdAt: -1 } },

      { $limit: 5 },
    ]);
  }
  async getWorkerRatingSummary(workerId: string) :Promise<{avgRating:number, totalReviews:number}> {
    const result = await Review.aggregate([
      {
        $match: {
          workerId: new Types.ObjectId(workerId),
          isVisible: true,
        },
      },

      {
        $group: {
          _id: "$workerId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return {
      avgRating: result[0]?.avgRating || 0,
      totalReviews: result[0]?.totalReviews || 0,
    };
  }
}
