import { ClientLayout } from "@/layouts/ClientLayout";
import { ApiError } from "@/api/api";
import { getMyBookings } from "@/services/booking.service";
import type { BookingApiItem, BookingStatus } from "@/types/booking.types";
import { getActiveTenantId } from "@/utils/auth";
import { formatDateTime } from "@/utils/format";
import { useEffect, useState } from "react";

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<BookingApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tenantId = getActiveTenantId();

    if (!tenantId) {
      setErrorMessage(
        "Select a service from a tenant-aware link first so we know which tenant to load bookings from.",
      );
      setIsLoading(false);
      return;
    }

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getMyBookings();
        setBookings(response);
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("We could not load your bookings right now.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadBookings();
  }, []);

  const normalizeStatus = (statusName: string | undefined): BookingStatus => {
    if (statusName === "confirmed" || statusName === "completed") {
      return statusName;
    }

    return "pending";
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
            {bookings.map((booking) => {
              const status = normalizeStatus(booking.status?.name);

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
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};
