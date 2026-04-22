import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getMe } from "@/api/usersApi";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import type { AuthUser, AuthUserRole } from "@/services/auth.service";
import { clearAuthSession, setActiveTenantId, setAuthUser } from "@/utils/auth";

const getLayoutForRole = (role: AuthUserRole | undefined) => {
  if (role === "provider") {
    return ProviderLayout;
  }

  if (role === "admin" || role === "platform_admin") {
    return AdminLayout;
  }

  return ClientLayout;
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const Layout = useMemo(() => getLayoutForRole(user?.role), [user?.role]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const profile = await getMe();
        if (cancelled) return;

        setAuthUser(profile);
        if (profile.tenantId) {
          setActiveTenantId(profile.tenantId);
        }
        setUserState(profile);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(error instanceof Error ? error.message : "Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate(routePaths.home);
  };

  if (loading) {
    return (
      <ClientLayout>
        <section className="section page-placeholder">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Profile</span>
              <h1 className="page-placeholder__title">Loading profile...</h1>
              <p>Please wait.</p>
            </div>
          </div>
        </section>
      </ClientLayout>
    );
  }

  if (!user) {
    return (
      <ClientLayout>
        <section className="section page-placeholder">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Profile</span>
              <h1 className="page-placeholder__title">Unable to load profile.</h1>
              <p>{errorMessage ?? "Please login again and retry."}</p>
            </div>

            <div className="page-placeholder__actions">
              <NavLink className="button" to={routePaths.login}>
                Go to login
              </NavLink>
              <NavLink className="button button--ghost" to={routePaths.home}>
                Back to homepage
              </NavLink>
            </div>
          </div>
        </section>
      </ClientLayout>
    );
  }

  return (
    <Layout>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Profile</span>
            <h1>Your account details</h1>
            <p>Basic info for the currently authenticated user.</p>
          </div>

          <div className="auth-card" style={{ maxWidth: 760 }}>
            <div className="auth-card__header">
              <h2>{user.fullName}</h2>
              <p>{user.email}</p>
            </div>

            <div className="service-details__meta-card" style={{ marginTop: "1.25rem" }}>
              <div>
                <span>User ID</span>
                <strong>{user.id}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>{user.role}</strong>
              </div>
              <div>
                <span>Tenant</span>
                <strong>{user.tenantId ?? "—"}</strong>
              </div>
            </div>

            <div className="auth-card__footer" style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <NavLink className="button button--ghost" to={routePaths.dashboard}>
                  Open dashboard
                </NavLink>
                <button className="button" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

