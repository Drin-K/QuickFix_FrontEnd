import { NavLink, useNavigate } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import { clearAuthSession, getAuthUser, isAuthenticated } from "@/utils/auth";

export const Navbar = () => {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const authenticated = isAuthenticated();
  const isClient = authUser?.role === "client";
  const isProvider = authUser?.role === "provider";
  const homeRoute =
    authUser?.role === "client"
      ? routePaths.clientHome
      : authUser?.role === "provider"
        ? routePaths.providerHome
        : authUser?.role === "admin" || authUser?.role === "platform_admin"
          ? routePaths.adminHome
          : routePaths.home;

  const navigationItems = isProvider
    ? [
        { label: "Home", to: homeRoute },
        { label: "Marketplace", to: routePaths.services },
        ...(authenticated
          ? [{ label: "My Services", to: routePaths.providerServices }]
          : []),
        ...(authenticated
          ? [{ label: "Bookings", to: routePaths.providerBookings }]
          : []),
        ...(authenticated
          ? [{ label: "Availability", to: routePaths.providerAvailability }]
          : []),
        ...(authenticated ? [{ label: "Profile", to: routePaths.profile }] : []),
      ]
    : [
        { label: "Home", to: homeRoute },
        { label: "Services", to: routePaths.services },
        ...(authenticated ? [{ label: "Profile", to: routePaths.profile }] : []),
        ...(isClient ? [{ label: "My Bookings", to: routePaths.myBookings }] : []),
        ...(!isClient && !isProvider && authenticated
          ? [{ label: "Dashboard", to: routePaths.dashboard }]
          : []),
      ];

  const handleLogout = () => {
    clearAuthSession();
    navigate(routePaths.home);
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink className="brand" to={homeRoute}>
          <span className="brand__mark">QF</span>
          <span>QuickFix</span>
        </NavLink>

        <nav className="navbar__nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {authenticated ? (
            <button className="button button--ghost" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <NavLink className="button button--ghost" to={routePaths.register}>
                Sign up
              </NavLink>
              <NavLink className="button" to={routePaths.login}>
                Log in
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
