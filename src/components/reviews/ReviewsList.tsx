import { ApiError } from "@/api/api";
import {
  getProviderReviews,
  type ProviderReviewsResponse,
} from "@/services/review.service";
import { formatDateTime } from "@/utils/format";
import { useEffect, useState } from "react";

type ReviewsListProps = {
  providerId: number;
};

export const ReviewsList = ({ providerId }: ReviewsListProps) => {
  const [reviewsData, setReviewsData] = useState<ProviderReviewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getProviderReviews(providerId);
        setReviewsData(response);
      } catch (error) {
        setReviewsData(null);
        setErrorMessage(
          error instanceof ApiError ? error.message : "We could not load reviews right now.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadReviews();
  }, [providerId]);

  return (
    <section className="service-details__panel reviews-panel">
      <div className="reviews-panel__header">
        <div>
          <span className="eyebrow">Reviews</span>
          <h2>Client feedback</h2>
          <p>Read public reviews left for this provider across completed bookings.</p>
        </div>

        {reviewsData ? (
          <div className="reviews-panel__summary" aria-label="Reviews summary">
            <div>
              <strong>{reviewsData.summary.averageRating ?? "New"}</strong>
              <span>average rating</span>
            </div>
            <div>
              <strong>{reviewsData.summary.count}</strong>
              <span>review{reviewsData.summary.count === 1 ? "" : "s"}</span>
            </div>
          </div>
        ) : null}
      </div>

      {isLoading ? <p>Loading provider reviews...</p> : null}
      {!isLoading && errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}

      {!isLoading && !errorMessage && reviewsData?.reviews.length === 0 ? (
        <div className="reviews-panel__empty">
          <strong>No reviews yet</strong>
          <p>This provider does not have public reviews yet.</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && reviewsData && reviewsData.reviews.length > 0 ? (
        <div className="reviews-panel__list">
          {reviewsData.reviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-card__header">
                <span className="review-card__rating">{review.rating}/5</span>
                <span>{formatDateTime(review.createdAt)}</span>
              </div>
              <p>{review.comment?.trim() || "No written comment was added for this rating."}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};
