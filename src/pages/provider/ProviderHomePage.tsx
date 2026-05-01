import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ProviderHomeLayout } from "@/layouts/ProviderHomeLayout";
import { routePaths } from "@/routes/routePaths";
import {
  getProviderProfile,
  getProviderSetupDraft,
  type ProviderProfileResponse,
} from "@/services/provider.service";
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
    description: "Review your account information and keep contact details current.",
    label: "Open profile",
    to: routePaths.profile,
  },
];

export const ProviderHomePage = () => {
  const user = getAuthUser();
  const displayName = user?.fullName || "Provider";
  const [providerProfile, setProviderProfile] = useState<ProviderProfileResponse | null>(
    null,
  );
  const [profileLoaded, setProfileLoaded] = useState(false);
  const setupDraft = getProviderSetupDraft();
  const setupComplete = profileLoaded
    ? Boolean(providerProfile?.individualDetails || providerProfile?.companyDetails)
    : Boolean(setupDraft?.isSetupComplete);

  useEffect(() => {
    let isMounted = true;

    const loadProviderProfile = async () => {
      try {
        const profile = await getProviderProfile();

        if (isMounted) {
          setProviderProfile(profile);
        }
      } catch {
        if (isMounted) {
          setProviderProfile(null);
        }
      } finally {
        if (isMounted) {
          setProfileLoaded(true);
        }
      }
    };

    void loadProviderProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
                <NavLink
                  className="button button--ghost"
                  to={routePaths.providerAvailability}
                >
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
            <article
              className={
                setupComplete
                  ? "workspace-action-card workspace-action-card--setup-complete"
                  : "workspace-action-card workspace-action-card--setup-needed"
              }
            >
              <div>
                <span className="workspace-status-label">
                  {setupComplete ? "Setup complete" : "Setup required"}
                </span>
                <h2>
                  {setupComplete
                    ? "Your provider profile is ready."
                    : "You are not set up yet."}
                </h2>
                <p>
                  {setupComplete
                    ? "Your basic provider details are saved. Verification is the next step before clients fully trust the profile."
                    : "Choose whether you work as an individual or company, then add the details clients need before booking."}
                </p>
              </div>
              <NavLink className="workspace-card-link" to={routePaths.providerSetup}>
                {setupComplete ? "Review setup" : "Start setup"}
              </NavLink>
            </article>

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
        </div>
      </section>
    </ProviderHomeLayout>
  );
};
