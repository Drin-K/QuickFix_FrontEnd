import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import { clearAuthSession, isAuthenticated } from "@/utils/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    clearAuthSession();
    return <Navigate replace state={{ from: location }} to={routePaths.login} />;
  }

  return <>{children}</>;
};
