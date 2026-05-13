import { ClientLayout } from "@/layouts/ClientLayout";
import { ApiError } from "@/api/api";
import { ReviewForm } from "@/components/bookings/ReviewForm";
import { routePaths } from "@/routes/routePaths";
import { getMyBookings } from "@/services/booking.service";
import type { BookingApiItem, BookingStatus, ReviewApiItem } from "@/types/booking.types";
import { clearAuthSession, getActiveTenantId } from "@/utils/auth";
import { formatDateTime } from "@/utils/format";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewSuccessMessages, setReviewSuccessMessages] = useState<Record<number, string>>({});

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
    );
  }, [bookings]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await getMyBookings();
      setBookings(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We could not load your bookings right now.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tenantId = getActiveTenantId();

    if (!tenantId) {
      setErrorMessage(
        "Select a service from a tenant-aware link first so we know which tenant to load bookings from.",
      );
      setIsLoading(false);
      return;
    }

    void loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeStatus = (statusName: string | undefined): BookingStatus => {
    if (statusName === "confirmed" || statusName === "completed") {
      return statusName;
    }

    return "pending";
  };

  const handleReviewCreated = (bookingId: number, review: ReviewApiItem) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              review: {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
              },
            }
          : booking,
      ),
    );
    setReviewSuccessMessages((current) => ({
      ...current,
      [bookingId]: review.provider?.averageRating
        ? `Review submitted successfully. Provider average rating is now ${review.provider.averageRating}.`
        : "Review submitted successfully.",
    }));
  };

  return (
    <ClientLayout>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">My bookings</span>
            <h1 className="page-placeholder__title">Your bookings</h1>
            <p>Review the bookings created from your account in one place.</p>
          </div>

          {isLoading ? <p>Loading your bookings...</p> : null}
          {!isLoading && errorMessage ? (
            <p className="auth-form__error">{errorMessage}</p>
          ) : null}
          {!isLoading && !errorMessage && bookings.length === 0 ? (
            <p>You do not have any bookings in the current tenant yet.</p>
          ) : null}

          <div className="bookings-list">
            {sortedBookings.map((booking) => {
              const status = normalizeStatus(booking.status?.name);
              const canCreateReview = status === "completed" && !booking.review;

              return (
                <article key={booking.id} className="booking-list-card">
                  <div className="booking-list-card__header">
                    <div>
                      <span className="eyebrow">Booking #{booking.id}</span>
                      <h2>{booking.service?.title ?? "Service booking"}</h2>
                    </div>
                    <span
                      className={`booking-list-card__status booking-list-card__status--${status}`}
                    >
                      {booking.status?.name ?? "pending"}
                    </span>
                  </div>

                  <div className="booking-list-card__meta">
                    <div>
                      <strong>Provider</strong>
                      <span>{booking.provider?.displayName ?? "Unknown provider"}</span>
                    </div>
                    <div>
                      <strong>Date</strong>
                      <span>{formatDateTime(booking.bookingDate)}</span>
                    </div>
                    <div>
                      <strong>Total</strong>
                      <span>EUR {booking.totalPrice}</span>
                    </div>
                  </div>

                  {booking.notes ? (
                    <p className="booking-list-card__notes">Notes: {booking.notes}</p>
                  ) : null}

                  <section className="booking-review-section">
                    <div className="booking-review-section__header">
                      <div>
                        <strong>Review</strong>
                        <p>
                          {booking.review
                            ? "Your feedback has been saved for this completed booking."
                            : canCreateReview
                              ? "Leave one review for this completed booking."
                              : "Reviews unlock only after the booking reaches completed status."}
                        </p>
                      </div>
                    </div>

                    {booking.review ? (
                      <div className="booking-review-summary">
                        {reviewSuccessMessages[booking.id] ? (
                          <p className="auth-form__success">
                            {reviewSuccessMessages[booking.id]}
                          </p>
                        ) : null}
                        <div className="booking-review-summary__header">
                          <span className="booking-review-rating">
                            {booking.review.rating}/5
                          </span>
                          <span>{formatDateTime(booking.review.createdAt)}</span>
                        </div>
                        <p>
                          {booking.review.comment?.trim() || "No written comment was added."}
                        </p>
                      </div>
                    ) : null}

                    {!booking.review && canCreateReview ? (
                      <ReviewForm
                        bookingId={booking.id}
                        onCreated={(review) => handleReviewCreated(booking.id, review)}
                      />
                    ) : null}

                    {!booking.review && !canCreateReview ? (
                      <p className="booking-review-note">
                        Complete bookings can be reviewed once. Pending and confirmed
                        bookings cannot receive reviews yet.
                      </p>
                    ) : null}
                  </section>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};
