import { NavLink } from "react-router-dom";
import { ProviderHomeLayout } from "@/layouts/ProviderHomeLayout";
import { routePaths } from "@/routes/routePaths";
import { getAuthUser } from "@/utils/auth";

const providerStats = [
  { label: "New requests", value: "6" },
  { label: "Available slots", value: "14" },
  { label: "Profile strength", value: "82%" },
];

const providerActions = [
  {
    title: "Manage bookings",
    description: "Review client requests and update each booking as work moves forward.",
    label: "Open bookings",
    to: routePaths.providerBookings,
  },
  {
    title: "Set availability",
    description: "Keep your working hours clear so clients can pick the right time.",
    label: "Edit availability",
    to: routePaths.providerAvailability,
  },
  {
    title: "Update profile",
    description: "Keep your provider details polished for clients comparing options.",
    label: "Open profile",
    to: routePaths.profile,
  },
];

export const ProviderHomePage = () => {
  const user = getAuthUser();
  const displayName = user?.fullName || "Provider";

  return (
    <ProviderHomeLayout>
      <section className="section role-home role-home--provider">
        <div className="container">
          <div className="workspace-hero workspace-hero--provider">
            <div>
              <span className="eyebrow">Provider workspace</span>
              <h1>Good to see you, {displayName}.</h1>
              <p>
                Keep bookings, availability, and client demand organized so every service
                request is easier to manage.
              </p>

              <div className="workspace-hero__actions">
                <NavLink className="button" to={routePaths.providerBookings}>
                  Review bookings
                </NavLink>
                <NavLink className="button button--ghost" to={routePaths.providerAvailability}>
                  Set availability
                </NavLink>
              </div>
            </div>

            <aside className="workspace-summary-card">
              <span>Today focus</span>
              <strong>Confirm pending jobs and keep your schedule current.</strong>
              <p>Small updates here help clients book with more confidence.</p>
            </aside>
          </div>

          <div className="workspace-stats">
            {providerStats.map((stat) => (
              <article className="workspace-stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="workspace-grid">
            {providerActions.map((action) => (
              <article className="workspace-action-card" key={action.title}>
                <div>
                  <h2>{action.title}</h2>
                  <p>{action.description}</p>
                </div>
                <NavLink className="workspace-card-link" to={action.to}>
                  {action.label}
                </NavLink>
              </article>
            ))}
          </div>

          <div className="workspace-panel workspace-panel--provider">
            <div>
              <span className="eyebrow">Operational checklist</span>
              <h2>Keep the business ready for new demand.</h2>
              <p>These small habits make the provider experience feel more complete.</p>
            </div>
            <div className="workspace-check-list">
              <span>Confirm pending requests</span>
              <span>Refresh weekly availability</span>
              <span>Review completed jobs</span>
            </div>
          </div>
        </div>
      </section>
    </ProviderHomeLayout>
  );
};
