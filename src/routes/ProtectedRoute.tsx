import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import { isAuthenticated } from "@/utils/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate replace to={routePaths.login} />;
  }

  return <>{children}</>;
};
