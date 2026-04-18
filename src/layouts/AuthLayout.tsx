import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import "@/styles/components.css";

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="page-shell" id="top">
      <header className="navbar">
        <div className="container navbar__inner">
          <NavLink className="brand" to="/">
            <span className="brand__mark">QF</span>
            <span>QuickFix</span>
          </NavLink>

          <div className="navbar__actions">
            <NavLink className="button button--ghost" to="/register">
              Create account
            </NavLink>
            <NavLink className="button" to="/login">
              Sign in
            </NavLink>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

