import { ApiError } from "@/api/api";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { getProviderBookings, updateBookingStatus } from "@/services/booking.service";
import type { BookingApiItem, BookingStatus } from "@/types/booking.types";
import { clearAuthSession } from "@/utils/auth";
import { formatDateTime } from "@/utils/format";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";

const normalizeStatus = (statusName: string | undefined): BookingStatus => {
  if (statusName === "confirmed" || statusName === "completed") {
    return statusName;
  }

  return "pending";
};

const statusOptions: Array<{ label: string; value: BookingStatus }> = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
];

export const ProviderBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
    );
  }, [bookings]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await getProviderBookings();
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
        setErrorMessage("We could not load provider bookings right now.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (bookingId: number, nextStatus: BookingStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(bookingId));
    setErrorMessage("");

    try {
      const updated = await updateBookingStatus(bookingId, nextStatus);
      setBookings((prev) => prev.map((item) => (item.id === bookingId ? updated : item)));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      setErrorMessage(error instanceof ApiError ? error.message : "Failed to update booking.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookingId);
        return next;
      });
    }
  };

  return (
    <ProviderLayout>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Provider bookings</span>
            <h1 className="page-placeholder__title">Bookings for your services</h1>
            <p>Review requests from clients and update booking statuses.</p>
          </div>

          {isLoading ? <p>Loading bookings...</p> : null}
          {!isLoading && errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}
          {!isLoading && !errorMessage && bookings.length === 0 ? (
            <p>No bookings yet. When clients book your services, they will appear here.</p>
          ) : null}

          <div className="bookings-list">
            {sortedBookings.map((booking) => {
              const status = normalizeStatus(booking.status?.name);
              const updating = updatingIds.has(booking.id);

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
                      <strong>Client</strong>
                      <span>{booking.client?.fullName ?? "Unknown client"}</span>
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
                    <p style={{ marginTop: "1rem", color: "var(--color-muted)" }}>
                      Notes: {booking.notes}
                    </p>
                  ) : null}

                  <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                    <label className="auth-form__field" style={{ margin: 0 }}>
                      <span>Status</span>
                      <select
                        className="auth-form__input"
                        value={status}
                        disabled={updating}
                        onChange={(event) =>
                          void handleStatusChange(
                            booking.id,
                            event.target.value as BookingStatus,
                          )
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {updating ? (
                      <div style={{ alignSelf: "flex-end", color: "var(--color-muted)" }}>
                        Updating...
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </ProviderLayout>
  );
};

