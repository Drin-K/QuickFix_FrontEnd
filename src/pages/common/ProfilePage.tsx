import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { getMe, type MeResponse } from "@/api/usersApi";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import type { AuthUserRole } from "@/services/auth.service";
import { updateProviderProfile } from "@/services/provider.service";
import {
  clearAuthSession,
  getAuthUser,
  setActiveTenantId,
  setAuthUser,
} from "@/utils/auth";

type ProfileFormState = {
  fullName: string;
  phone: string;
  providerDisplayName: string;
  providerDescription: string;
  providerAddress: string;
};

type FeedbackState = {
  tone: "info" | "error";
  message: string;
} | null;

const PROVIDER_PROFILE_UPDATES_ENABLED = true;

const getLayoutForRole = (role: AuthUserRole | undefined) => {
  if (role === "provider") {
    return ProviderLayout;
  }

  if (role === "admin" || role === "platform_admin") {
    return AdminLayout;
  }

  return ClientLayout;
};

const getRoleLabel = (role: AuthUserRole | undefined) => {
  switch (role) {
    case "provider":
      return "Provider";
    case "admin":
      return "Admin";
    case "platform_admin":
      return "Platform admin";
    case "client":
      return "Client";
    default:
      return "User";
  }
};

const getRoleDescription = (role: AuthUserRole | undefined) => {
  switch (role) {
    case "provider":
      return "Manage client demand, availability, and provider verification from one place.";
    case "admin":
    case "platform_admin":
      return "Review your authenticated account context and keep core account details organized.";
    case "client":
    default:
      return "Keep your account details ready before your next service request or booking.";
  }
};

const getDashboardRoute = (role: AuthUserRole | undefined) => {
  switch (role) {
    case "provider":
      return routePaths.providerHome;
    case "admin":
    case "platform_admin":
      return routePaths.adminDashboard;
    case "client":
      return routePaths.clientHome;
    default:
      return routePaths.dashboard;
  }
};

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const getTenantLabel = (user: MeResponse) => {
  if (user.tenant) {
    return `${user.tenant.name} (#${user.tenant.id})`;
  }

  if (user.tenantId) {
    return `Tenant #${user.tenantId}`;
  }

  return "No tenant context";
};

const buildFormState = (user: MeResponse): ProfileFormState => ({
  fullName: user.fullName,
  phone: user.phone ?? "",
  providerDisplayName: user.provider?.displayName ?? "",
  providerDescription: user.provider?.description ?? "",
  providerAddress: user.provider?.address ?? "",
});

export const ProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = getAuthUser();
  const activeRole = storedUser?.role;

  const [user, setUserState] = useState<MeResponse | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const role = user?.role ?? activeRole;
  const Layout = useMemo(() => getLayoutForRole(role), [role]);

  const loadProfile = async () => {
    setLoading(true);
    setErrorMessage(null);
    setFeedback(null);

    try {
      const profile = await getMe();

      setAuthUser(profile);
      if (profile.tenantId) {
        setActiveTenantId(profile.tenantId);
      }

      setUserState(profile);
      setFormValues(buildFormState(profile));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      setErrorMessage(error instanceof Error ? error.message : "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate(routePaths.home);
  };

  const handleFieldChange = (field: keyof ProfileFormState, value: string) => {
    setFormValues((current) => (current ? { ...current, [field]: value } : current));
    if (feedback) {
      setFeedback(null);
    }
  };

  const handleStartEditing = () => {
    if (!user) {
      return;
    }

    setFormValues(buildFormState(user));
    setIsEditing(true);
    setFeedback(null);
  };

  const handleCancelEditing = () => {
    if (!user) {
      return;
    }

    setFormValues(buildFormState(user));
    setIsEditing(false);
    setFeedback(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !formValues) {
      return;
    }

    if (user.role !== "provider" || !user.provider) {
      setFeedback({
        tone: "info",
        message:
          "Account profile editing is not connected to a backend update endpoint yet.",
      });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const providerProfile = await updateProviderProfile({
        displayName: formValues.providerDisplayName.trim(),
        description: formValues.providerDescription.trim() || undefined,
        address: formValues.providerAddress.trim() || undefined,
      });
      const nextUser: MeResponse = {
        ...user,
        provider: {
          ...user.provider,
          type: providerProfile.provider.type,
          displayName: providerProfile.provider.displayName,
          description: providerProfile.provider.description,
          cityId: providerProfile.provider.cityId,
          address: providerProfile.provider.address,
          isVerified: providerProfile.provider.isVerified,
          averageRating:
            providerProfile.provider.averageRating !== null
              ? String(providerProfile.provider.averageRating)
              : null,
        },
      };

      setAuthUser(nextUser);
      setUserState(nextUser);
      setFormValues(buildFormState(nextUser));
      setIsEditing(false);
      setFeedback({
        tone: "info",
        message: "Provider profile updated successfully.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Provider profile could not be updated.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="section profile-page">
          <div className="container">
            <div className="profile-state-card">
              <span className="eyebrow">Profile</span>
              <h1>Loading your profile</h1>
              <p>We are fetching the latest account details from the API.</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user || !formValues) {
    return (
      <Layout>
        <section className="section profile-page">
          <div className="container">
            <div className="profile-state-card profile-state-card--error">
              <span className="eyebrow">Profile</span>
              <h1>Unable to load profile</h1>
              <p>{errorMessage ?? "Please login again and retry."}</p>
              <div className="profile-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => void loadProfile()}
                >
                  Retry
                </button>
                <NavLink className="button button--ghost" to={routePaths.login}>
                  Go to login
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const roleLabel = getRoleLabel(user.role);
  const tenantLabel = getTenantLabel(user);
  const providerVerified = Boolean(user.provider?.isVerified);
  const dashboardRoute = getDashboardRoute(user.role);
  const isProvider = user.role === "provider" && Boolean(user.provider);
  const canSaveProviderProfile = isProvider && PROVIDER_PROFILE_UPDATES_ENABLED;

  return (
    <Layout>
      <section className={`section profile-page profile-page--${user.role}`}>
        <div className="container">
          <div className="profile-hero">
            <div className="profile-hero__content">
              <span className="eyebrow">Profile</span>
              <h1>{user.fullName}</h1>
              <p>{getRoleDescription(user.role)}</p>

              <div className="profile-badges">
                <span className="profile-badge">{roleLabel}</span>
                <span className="profile-badge">{tenantLabel}</span>
                {isProvider ? (
                  <span
                    className={
                      providerVerified
                        ? "profile-badge profile-badge--success"
                        : "profile-badge profile-badge--warning"
                    }
                  >
                    {providerVerified ? "Verified provider" : "Verification pending"}
                  </span>
                ) : null}
              </div>
            </div>

            <aside className="profile-summary-card">
              <div className="profile-summary-card__avatar" aria-hidden="true">
                {getInitials(user.fullName) || "QF"}
              </div>

              <div>
                <strong>{user.email}</strong>
                <p>{user.phone || "No phone number on file yet."}</p>
              </div>

              <div className="profile-summary-grid">
                <article>
                  <span>Role</span>
                  <strong>{roleLabel}</strong>
                </article>
                <article>
                  <span>User ID</span>
                  <strong>#{user.id}</strong>
                </article>
                <article>
                  <span>Tenant</span>
                  <strong>{user.tenantId ? `#${user.tenantId}` : "-"}</strong>
                </article>
                <article>
                  <span>Workspace</span>
                  <strong>{isProvider ? "Provider" : roleLabel}</strong>
                </article>
              </div>
            </aside>
          </div>

          <div className="profile-grid">
            <div className="profile-stack">
              <section className="profile-panel">
                <div className="profile-panel__header">
                  <div>
                    <span className="eyebrow">Overview</span>
                    <h2>Account information</h2>
                  </div>
                  <p>Real user data loaded from `GET /users/me`.</p>
                </div>

                <div className="profile-info-grid">
                  <article className="profile-info-card">
                    <span>Full name</span>
                    <strong>{user.fullName}</strong>
                    <p>Primary display name for the authenticated account.</p>
                  </article>
                  <article className="profile-info-card">
                    <span>Email</span>
                    <strong>{user.email}</strong>
                    <p>Used for sign-in and account communication.</p>
                  </article>
                  <article className="profile-info-card">
                    <span>Phone</span>
                    <strong>{user.phone || "Not added yet"}</strong>
                    <p>Useful for booking coordination and contact updates.</p>
                  </article>
                  <article className="profile-info-card">
                    <span>Role</span>
                    <strong>{roleLabel}</strong>
                    <p>Controls which workspace tools and routes are available.</p>
                  </article>
                </div>
              </section>

              <section className="profile-panel">
                <div className="profile-panel__header">
                  <div>
                    <span className="eyebrow">Details</span>
                    <h2>Structured profile sections</h2>
                  </div>
                  <p>Everything is grouped clearly so the page is easier to scan.</p>
                </div>

                <div className="profile-section-grid">
                  <article className="profile-section-card">
                    <h3>Access & identity</h3>
                    <dl className="profile-definition-list">
                      <div>
                        <dt>User ID</dt>
                        <dd>{user.id}</dd>
                      </div>
                      <div>
                        <dt>Role</dt>
                        <dd>{roleLabel}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{user.email}</dd>
                      </div>
                    </dl>
                  </article>

                  <article className="profile-section-card">
                    <h3>Workspace context</h3>
                    <dl className="profile-definition-list">
                      <div>
                        <dt>Tenant</dt>
                        <dd>{tenantLabel}</dd>
                      </div>
                      <div>
                        <dt>Phone</dt>
                        <dd>{user.phone || "No phone added"}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>
                          {isProvider
                            ? providerVerified
                              ? "Verified"
                              : "Pending"
                            : "Active"}
                        </dd>
                      </div>
                    </dl>
                  </article>

                  {isProvider && user.provider ? (
                    <article className="profile-section-card profile-section-card--provider">
                      <h3>Provider profile</h3>
                      <dl className="profile-definition-list">
                        <div>
                          <dt>Display name</dt>
                          <dd>{user.provider.displayName}</dd>
                        </div>
                        <div>
                          <dt>Provider type</dt>
                          <dd>{user.provider.type}</dd>
                        </div>
                        <div>
                          <dt>Address</dt>
                          <dd>{user.provider.address || "Not added yet"}</dd>
                        </div>
                        <div>
                          <dt>Description</dt>
                          <dd>
                            {user.provider.description || "No provider description yet."}
                          </dd>
                        </div>
                      </dl>
                    </article>
                  ) : null}
                </div>
              </section>

              <section className="profile-panel">
                <div className="profile-panel__header">
                  <div>
                    <span className="eyebrow">Edit</span>
                    <h2>Profile form</h2>
                  </div>
                  <p>
                    Cleaner editing layout with role-aware fields and consistent spacing.
                  </p>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="profile-form__toolbar">
                    <div className="profile-form__status">
                      <strong>
                        {isEditing ? "Editing draft" : "Viewing current values"}
                      </strong>
                      <span>
                        {canSaveProviderProfile
                          ? "Only provider business fields below are connected to save."
                          : "Account profile save support is waiting on a backend update endpoint."}
                      </span>
                    </div>

                    <div className="profile-form__actions">
                      {isEditing ? (
                        <>
                          <button
                            className="button button--ghost"
                            type="button"
                            onClick={handleCancelEditing}
                          >
                            Cancel
                          </button>
                          <button
                            className="button"
                            disabled={
                              !canSaveProviderProfile || isSaving
                            }
                            type="submit"
                          >
                            {isSaving ? "Saving..." : "Save changes"}
                          </button>
                        </>
                      ) : (
                        <button
                          className="button"
                          disabled={!canSaveProviderProfile}
                          type="button"
                          onClick={handleStartEditing}
                        >
                          {canSaveProviderProfile
                            ? "Edit provider profile"
                            : "Editing coming soon"}
                        </button>
                      )}
                    </div>
                  </div>

                  {feedback ? (
                    <div
                      className={
                        feedback.tone === "error"
                          ? "profile-feedback profile-feedback--error"
                          : "profile-feedback"
                      }
                    >
                      {feedback.message}
                    </div>
                  ) : null}

                  <div className="profile-form__grid">
                    <label className="auth-form__field">
                      <span>Full name</span>
                      <input
                        className="auth-form__input"
                        disabled
                        value={formValues.fullName}
                        onChange={(event) =>
                          handleFieldChange("fullName", event.target.value)
                        }
                      />
                    </label>

                    <label className="auth-form__field">
                      <span>Email</span>
                      <input className="auth-form__input" disabled value={user.email} />
                    </label>

                    <label className="auth-form__field">
                      <span>Phone</span>
                      <input
                        className="auth-form__input"
                        disabled
                        placeholder="Add a phone number"
                        value={formValues.phone}
                        onChange={(event) =>
                          handleFieldChange("phone", event.target.value)
                        }
                      />
                    </label>

                    <label className="auth-form__field">
                      <span>Role</span>
                      <input className="auth-form__input" disabled value={roleLabel} />
                    </label>

                    {isProvider ? (
                      <>
                        <label className="auth-form__field">
                          <span>Provider display name</span>
                          <input
                            className="auth-form__input"
                            disabled={!isEditing || !canSaveProviderProfile}
                            value={formValues.providerDisplayName}
                            onChange={(event) =>
                              handleFieldChange("providerDisplayName", event.target.value)
                            }
                          />
                        </label>

                        <label className="auth-form__field">
                          <span>Provider address</span>
                          <input
                            className="auth-form__input"
                            disabled={!isEditing || !canSaveProviderProfile}
                            placeholder="Business address"
                            value={formValues.providerAddress}
                            onChange={(event) =>
                              handleFieldChange("providerAddress", event.target.value)
                            }
                          />
                        </label>

                        <label className="auth-form__field profile-form__field--wide">
                          <span>Provider description</span>
                          <textarea
                            className="auth-form__input profile-form__textarea"
                            disabled={!isEditing || !canSaveProviderProfile}
                            placeholder="Describe your services and specialties"
                            value={formValues.providerDescription}
                            onChange={(event) =>
                              handleFieldChange("providerDescription", event.target.value)
                            }
                          />
                        </label>
                      </>
                    ) : null}
                  </div>
                </form>
              </section>
            </div>

            <aside className="profile-sidebar">
              <section className="profile-panel profile-panel--compact">
                <div className="profile-panel__header">
                  <div>
                    <span className="eyebrow">Actions</span>
                    <h2>Quick links</h2>
                  </div>
                </div>

                <div className="profile-actions profile-actions--stacked">
                  <NavLink className="button" to={dashboardRoute}>
                    Open workspace
                  </NavLink>
                  {user.role === "client" ? (
                    <NavLink className="button button--ghost" to={routePaths.myBookings}>
                      View bookings
                    </NavLink>
                  ) : null}
                  {user.role === "provider" ? (
                    <>
                      <NavLink
                        className="button button--ghost"
                        to={routePaths.providerBookings}
                      >
                        View bookings
                      </NavLink>
                      <NavLink
                        className="button button--ghost"
                        to={routePaths.providerAvailability}
                      >
                        Manage availability
                      </NavLink>
                    </>
                  ) : null}
                  <button
                    className="button button--ghost"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </section>

              <section className="profile-panel profile-panel--compact">
                <div className="profile-panel__header">
                  <div>
                    <span className="eyebrow">Status</span>
                    <h2>Profile health</h2>
                  </div>
                </div>

                <div className="profile-health-list">
                  <article>
                    <strong>{user.phone ? "Complete" : "Needs attention"}</strong>
                    <span>
                      {user.phone
                        ? "Contact phone is available."
                        : "Add a phone number when API updates are supported."}
                    </span>
                  </article>
                  <article>
                    <strong>
                      {isProvider ? (providerVerified ? "Verified" : "Pending") : "Ready"}
                    </strong>
                    <span>
                      {isProvider
                        ? providerVerified
                          ? "Provider verification is complete."
                          : "Provider verification is still pending."
                        : "Client profile is ready for bookings."}
                    </span>
                  </article>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};
