import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import type { AuthUserRole } from "@/services/auth.service";
import { getAuthUser, isAuthenticated } from "@/utils/auth";

type PublicRouteProps = {
  children: ReactNode;
};

const getAuthenticatedHomeRoute = (role?: AuthUserRole) => {
  switch (role) {
    case "provider":
      return routePaths.providerHome;
    case "admin":
    case "platform_admin":
      return routePaths.adminDashboard;
    case "client":
      return routePaths.clientHome;
    default:
      return routePaths.home;
  }
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const location = useLocation();
  const user = getAuthUser();

  if (
    isAuthenticated() &&
    (location.pathname === routePaths.login || location.pathname === routePaths.register)
  ) {
    return <Navigate replace to={getAuthenticatedHomeRoute(user?.role)} />;
  }

  return <>{children}</>;
};
