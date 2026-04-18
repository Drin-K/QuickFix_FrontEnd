import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
  { label: "Dashboard", to: "/dashboard" },
];

export const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink className="brand" to="/">
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
          <NavLink className="button button--ghost" to="/register">
            Become a provider
          </NavLink>
          <NavLink className="button" to="/login">
            Book now
          </NavLink>
        </div>
      </div>
    </header>
  );
};
