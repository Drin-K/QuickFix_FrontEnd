import { ApiError } from "@/api/api";
import { createBooking } from "@/services/booking.service";
import { PublicLayout } from "@/layouts/PublicLayout";
import { getServiceById } from "@/services/service.service";
import type { ServiceApiDetails } from "@/types/service.types";
import {
  getActiveTenantId,
  getAuthUser,
  isAuthenticated,
  setActiveTenantId,
} from "@/utils/auth";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

export const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [service, setService] = useState<ServiceApiDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const authUser = getAuthUser();
  const canBook = isAuthenticated() && authUser?.role === "client";

  useEffect(() => {
    const serviceId = Number(id);
    const tenantIdFromQuery = Number(searchParams.get("tenantId"));
    const tenantId =
      Number.isInteger(tenantIdFromQuery) && tenantIdFromQuery > 0
        ? tenantIdFromQuery
        : getActiveTenantId();

    if (tenantId) {
      setActiveTenantId(tenantId);
    }

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      setErrorMessage("The requested service id is invalid.");
      setIsLoading(false);
      return;
    }

    if (!tenantId) {
      setErrorMessage(
        "Tenant context is missing for this service. Open the service link with a valid tenant first.",
      );
      setIsLoading(false);
      return;
    }

    const loadService = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getServiceById(serviceId, tenantId);
        setService(response);
        setActiveTenantId(response.tenantId);
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("We could not load the requested service.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadService();
  }, [id, searchParams]);

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!service) {
      return;
    }

    if (!bookingDate) {
      setBookingError("Choose a booking date and time first.");
      setBookingSuccess("");
      return;
    }

    try {
      setIsSubmittingBooking(true);
      setBookingError("");
      setBookingSuccess("");

      await createBooking({
        serviceId: service.id,
        bookingDate: new Date(bookingDate).toISOString(),
        notes: notes.trim() || undefined,
      });

      setBookingSuccess("Booking created successfully.");
      setNotes("");
      setBookingDate("");
    } catch (error) {
      if (error instanceof ApiError) {
        setBookingError(error.message);
      } else {
        setBookingError("We could not create your booking right now.");
      }
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <section className="section service-details">
          <div className="container">
            <div className="service-details__panel">
              <span className="eyebrow">Loading service</span>
              <h1>We are loading the selected service.</h1>
              <p>Please wait a moment.</p>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  if (!service) {
    return (
      <PublicLayout>
        <section className="section service-details">
          <div className="container">
            <div className="service-details__panel">
              <span className="eyebrow">Service not found</span>
              <h1>We could not find the service you requested.</h1>
              <p>
                {errorMessage ||
                  "The selected service may not exist yet, or the link may be incomplete."}
              </p>
              <Link className="button" to="/">
                Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="section service-details">
        <div className="container">
          <div className="service-details__hero">
            <div>
              <span className="eyebrow">{service.category.name}</span>
              <h1>{service.title}</h1>
              <p>
                {service.description ??
                  "No detailed description is available yet for this service."}
              </p>
            </div>

            <div className="service-details__stats">
              <div className="service-details__meta-card">
                <h2>Provider</h2>
                <strong>{service.provider.displayName}</strong>
                <p>
                  {service.provider.description ??
                    "Provider description will appear here when available."}
                </p>
              </div>

              <div className="service-details__meta-card">
                <h2>Pricing</h2>
                <strong>Starting from EUR {service.basePrice}</strong>
                <p>
                  {service.isActive ? "Available for booking" : "Currently unavailable"}
                </p>
              </div>
            </div>
          </div>

          <div className="service-details__content">
            <div className="service-details__panel">
              <h2>What is included</h2>
              <p>
                This page now reads real service details from the backend and keeps
                booking creation tied to the current tenant context.
              </p>
              <ul className="service-details__highlights">
                <li>Provider: {service.provider.displayName}</li>
                <li>Category: {service.category.name}</li>
                <li>Tenant id: {service.tenantId}</li>
                <li>Status: {service.isActive ? "Active" : "Inactive"}</li>
              </ul>
            </div>

            <aside className="service-details__sidebar">
              <div className="service-details__meta-card">
                <h2>Service summary</h2>
                <div className="service-details__meta-list">
                  <div>
                    <strong>Service id</strong>
                    <span>{service.id}</span>
                  </div>
                  <div>
                    <strong>Category</strong>
                    <span>{service.category.name}</span>
                  </div>
                  <div>
                    <strong>Status</strong>
                    <span>
                      {service.isActive ? "Available for booking" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              {canBook ? (
                <form className="auth-form" noValidate onSubmit={handleBookingSubmit}>
                  <label className="auth-form__field">
                    <span>Booking date and time</span>
                    <input
                      className="auth-form__input"
                      min={new Date().toISOString().slice(0, 16)}
                      type="datetime-local"
                      value={bookingDate}
                      onChange={(event) => setBookingDate(event.target.value)}
                    />
                  </label>

                  <label className="auth-form__field">
                    <span>Notes</span>
                    <textarea
                      className="auth-form__input"
                      placeholder="Add any extra details for the provider"
                      rows={4}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </label>

                  <button
                    className="button auth-form__submit"
                    disabled={isSubmittingBooking}
                    type="submit"
                  >
                    {isSubmittingBooking ? "Creating booking..." : "Book this service"}
                  </button>

                  {bookingError ? (
                    <p className="auth-form__error">{bookingError}</p>
                  ) : null}
                  {bookingSuccess ? (
                    <p className="auth-form__success">{bookingSuccess}</p>
                  ) : null}
                </form>
              ) : (
                <Link className="button" to="/login">
                  Login as client to book
                </Link>
              )}
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
