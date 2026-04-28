import { useEffect, useMemo, useState } from "react";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import {
  availabilityService,
  type AvailabilitySlot,
} from "@/services/availability.service";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const AvailabilityPage = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (!startTime || !endTime) {
      return false;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    return start.getTime() < end.getTime();
  }, [endTime, startTime]);

  const loadSlots = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const results = await availabilityService.list();
      setSlots(results);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSlots();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!canSubmit) {
      setErrorMessage("Please provide a valid time range.");
      return;
    }

    setSubmitting(true);
    try {
      await availabilityService.create({
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      setStartTime("");
      setEndTime("");
      await loadSlots();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create slot.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slotId: number) => {
    setErrorMessage(null);
    try {
      await availabilityService.remove(slotId);
      await loadSlots();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete slot.");
    }
  };

  return (
    <ProviderLayout>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Availability</span>
            <h1>Manage your availability slots</h1>
            <p>Create and remove time slots customers can book.</p>
          </div>

          <div className="auth-card" style={{ maxWidth: 860 }}>
            <div className="auth-card__header">
              <h2>Add a new slot</h2>
              <p>Pick a start and end time, then save it to your availability calendar.</p>
            </div>

            <form className="auth-form" onSubmit={handleCreate}>
              <label className="auth-form__field">
                <span>Start time</span>
                <input
                  className="auth-form__input"
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  required
                />
              </label>

              <label className="auth-form__field">
                <span>End time</span>
                <input
                  className="auth-form__input"
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  required
                />
              </label>

              {errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}

              <div className="auth-form__meta">
                <button className="button" type="submit" disabled={!canSubmit || submitting}>
                  {submitting ? "Saving..." : "Add slot"}
                </button>
              </div>
            </form>
          </div>

          <div className="auth-card" style={{ maxWidth: 860, marginTop: "1.75rem" }}>
            <div className="auth-card__header">
              <h2>Your existing slots</h2>
              <p>{loading ? "Loading slots..." : `${slots.length} slot(s) found.`}</p>
            </div>

            {slots.length === 0 && !loading ? (
              <p style={{ color: "var(--color-muted)" }}>
                No availability slots yet. Add one above to get started.
              </p>
            ) : null}

            <div className="services-grid" style={{ marginTop: "1.25rem" }}>
              {slots.map((slot) => (
                <article key={slot.id} className="service-card">
                  <h3>{formatDateTime(slot.startTime)}</h3>
                  <p>Ends: {formatDateTime(slot.endTime)}</p>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <span style={{ color: "var(--color-muted)", fontWeight: 600 }}>
                      {slot.isBooked ? "Booked" : "Available"}
                    </span>
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={() => handleDelete(slot.id)}
                      disabled={slot.isBooked}
                      title={slot.isBooked ? "Booked slots cannot be removed." : "Remove slot"}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ProviderLayout>
  );
};

