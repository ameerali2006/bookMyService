import { inject, injectable } from "tsyringe";
import { IReviewService } from "../../interface/service/review.service.Interface";
import { TYPES } from "../../config/constants/types";
import { IReviewRepository } from "../../interface/repository/review.repository.interface";
import { IBookingRepository } from "../../interface/repository/booking.repository.interface";
@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.ReviewRepository) private reviewRepo: IReviewRepository,
    @inject(TYPES.BookingRepository) private bookingRepo: IBookingRepository,
  ) {}
  async addReview(
    comment: string,
    rating: number,
    bookingId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
    review?: { comment: string; rating: number; createdAt: string };
  }> {
    try {
      // 1. check booking exists
      const booking = await this.bookingRepo.findById(bookingId);

      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
        };
      }

      // 2. check ownership
      if (booking.userId.toString() !== userId) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      // 3. check completed
      if (booking.status !== "completed") {
        return {
          success: false,
          message: "You can only review completed bookings",
        };
      }

      // 4. check already reviewed
      const existingReview = await this.reviewRepo.findByBookingId(bookingId);

      if (existingReview) {
        return {
          success: false,
          message: "Review already submitted",
        };
      }

      // 5. create review
      const review = await this.reviewRepo.create({
        bookingId,
        userId,
        workerId: booking.workerId,
        comment,
        rating,
      });
      if (!review) {
        return {
          success: false,
          message: "Review already submitted",
        };
      }

      // optional: update booking flag
      await this.bookingRepo.updateById(bookingId, {
        reviewId: review._id,
      });

      return {
        success: true,
        message: "Review added successfully",
        review: {
          comment: review.comment,
          rating: review.rating,
          createdAt: review.createdAt.toISOString(),
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Failed to add review",
      };
    }
  }
}
