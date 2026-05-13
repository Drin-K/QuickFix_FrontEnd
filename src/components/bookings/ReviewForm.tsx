import { ApiError } from "@/api/api";
import { routePaths } from "@/routes/routePaths";
import { createReview } from "@/services/review.service";
import type { ReviewApiItem } from "@/types/booking.types";
import { clearAuthSession } from "@/utils/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ReviewFormProps = {
  bookingId: number;
  onCreated: (review: ReviewApiItem) => void;
};

const DEFAULT_RATING = "5";

export const ReviewForm = ({ bookingId, onCreated }: ReviewFormProps) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(DEFAULT_RATING);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextRating = Number(rating);

    if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
      setErrorMessage("Choose a rating from 1 to 5 before submitting your review.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const review = await createReview({
        bookingId,
        rating: nextRating,
        comment: comment.trim() || undefined,
      });

      onCreated(review);
      setComment("");
      setRating(DEFAULT_RATING);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      setErrorMessage(
        error instanceof ApiError ? error.message : "We could not submit your review right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="booking-review-form" onSubmit={handleSubmit}>
      <div className="booking-review-form__grid">
        <label className="auth-form__field">
          <span>Rating</span>
          <select
            className="auth-form__input"
            disabled={isSubmitting}
            value={rating}
            onChange={(event) => {
              setRating(event.target.value);
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Needs work</option>
            <option value="1">1 - Poor</option>
          </select>
        </label>

        <label className="auth-form__field booking-review-form__field--wide">
          <span>Comment</span>
          <textarea
            className="auth-form__input booking-review-form__textarea"
            disabled={isSubmitting}
            maxLength={2000}
            placeholder="Share a few details about the completed service."
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              if (errorMessage) {
                setErrorMessage("");
              }
            }}
          />
        </label>
      </div>

      {errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}

      <div className="booking-review-form__actions">
        <button className="button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </form>
  );
};
