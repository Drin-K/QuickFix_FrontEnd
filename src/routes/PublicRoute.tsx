import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import { getAuthUser, isAuthenticated } from "@/utils/auth";

type PublicRouteProps = {
  children: ReactNode;
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const location = useLocation();
  const user = getAuthUser();

  if (
    isAuthenticated() &&
    user?.role === "client" &&
    (location.pathname === routePaths.login || location.pathname === routePaths.register)
  ) {
    return <Navigate replace to={routePaths.clientHome} />;
  }

  return <>{children}</>;
};
