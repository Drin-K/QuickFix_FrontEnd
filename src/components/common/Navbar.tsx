import { NavLink, useNavigate } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import { clearAuthSession, getAuthUser, isAuthenticated } from "@/utils/auth";

export const Navbar = () => {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const authenticated = isAuthenticated();
  const isClient = authUser?.role === "client";

  const navigationItems = [
    { label: "Home", to: routePaths.home },
    { label: "Services", to: routePaths.services },
    ...(authenticated ? [{ label: "Profile", to: routePaths.profile }] : []),
    ...(isClient ? [{ label: "My Bookings", to: routePaths.myBookings }] : []),
    ...(!authenticated
      ? [
          { label: "Login", to: routePaths.login },
          { label: "Register", to: routePaths.register },
        ]
      : []),
    ...(!isClient && authenticated
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
        <NavLink className="brand" to={routePaths.home}>
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
                Become a provider
              </NavLink>
              <NavLink className="button" to={routePaths.login}>
                Book now
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
