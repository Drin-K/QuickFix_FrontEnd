import { ClientLayout } from "@/layouts/ClientLayout";
import type { BookingListItem } from "@/types/booking.types";

const mockBookings: BookingListItem[] = [
  {
    id: 101,
    serviceTitle: "Electrical Repair Visit",
    providerName: "Arber Kola",
    bookingDate: "21 Apr 2026, 10:00",
    status: "confirmed",
    totalPrice: 35,
  },
  {
    id: 102,
    serviceTitle: "Bathroom Plumbing Fix",
    providerName: "Nora Plumbing Co.",
    bookingDate: "24 Apr 2026, 14:30",
    status: "pending",
    totalPrice: 28,
  },
  {
    id: 103,
    serviceTitle: "Furniture Assembly",
    providerName: "Mira Home Services",
    bookingDate: "18 Apr 2026, 09:00",
    status: "completed",
    totalPrice: 22,
  },
];

export const MyBookingsPage = () => {
  return (
    <ClientLayout>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">My bookings</span>
            <h1 className="page-placeholder__title">Your bookings</h1>
            <p>Review the bookings created from your account in one place.</p>
          </div>

          <div className="bookings-list">
            {mockBookings.map((booking) => (
              <article key={booking.id} className="booking-list-card">
                <div className="booking-list-card__header">
                  <div>
                    <span className="eyebrow">Booking #{booking.id}</span>
                    <h2>{booking.serviceTitle}</h2>
                  </div>
                  <span className={`booking-list-card__status booking-list-card__status--${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-list-card__meta">
                  <div>
                    <strong>Provider</strong>
                    <span>{booking.providerName}</span>
                  </div>
                  <div>
                    <strong>Date</strong>
                    <span>{booking.bookingDate}</span>
                  </div>
                  <div>
                    <strong>Total</strong>
                    <span>EUR {booking.totalPrice}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};
