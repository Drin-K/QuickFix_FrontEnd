import { NavLink } from "react-router-dom";
import { ClientHomeLayout } from "@/layouts/ClientHomeLayout";
import { routePaths } from "@/routes/routePaths";
import { getAuthUser } from "@/utils/auth";

const clientStats = [
  { label: "Open requests", value: "2" },
  { label: "Trusted providers", value: "8" },
  { label: "Avg. response", value: "18 min" },
];

const clientActions = [
  {
    title: "Find a service",
    description: "Browse the marketplace and choose the right service for your home.",
    label: "Explore services",
    to: routePaths.services,
  },
  {
    title: "Track bookings",
    description: "Follow request status, appointment details, and completed jobs.",
    label: "View bookings",
    to: routePaths.myBookings,
  },
  {
    title: "Keep profile ready",
    description: "Make sure your account details are ready before the next request.",
    label: "Open profile",
    to: routePaths.profile,
  },
];

export const ClientHomePage = () => {
  const user = getAuthUser();
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <ClientHomeLayout>
      <section className="section role-home role-home--client">
        <div className="container">
          <div className="workspace-hero workspace-hero--client">
            <div>
              <span className="eyebrow">Client workspace</span>
              <h1>Welcome back, {firstName}.</h1>
              <p>
                Start a new request, review bookings, and keep your home service activity
                organized from one clean place.
              </p>

              <div className="workspace-hero__actions">
                <NavLink className="button" to={routePaths.services}>
                  Book a service
                </NavLink>
                <NavLink className="button button--ghost" to={routePaths.myBookings}>
                  My bookings
                </NavLink>
              </div>
            </div>

            <aside className="workspace-summary-card">
              <span>Next best step</span>
              <strong>Compare providers before sending your next request.</strong>
              <p>Choose a category, review service details, and continue into booking.</p>
            </aside>
          </div>

          <div className="workspace-stats">
            {clientStats.map((stat) => (
              <article className="workspace-stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="workspace-grid">
            {clientActions.map((action) => (
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

          <div className="workspace-panel">
            <div>
              <span className="eyebrow">Popular starting points</span>
              <h2>Need help today?</h2>
              <p>Most clients start by checking these categories before creating a request.</p>
            </div>
            <div className="workspace-pill-list">
              <span>Electrical</span>
              <span>Plumbing</span>
              <span>Home care</span>
              <span>Urgent repair</span>
            </div>
          </div>
        </div>
      </section>
    </ClientHomeLayout>
  );
};
