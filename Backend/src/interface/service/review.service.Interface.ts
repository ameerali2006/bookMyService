export interface IReviewService {
  addReview(
    comment: string,
    rating: number,
    bookingId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
    review?: { comment: string; rating: number; createdAt: string };
  }>;
}
