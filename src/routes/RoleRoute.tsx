import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import type { AuthUserRole } from "@/services/auth.service";
import { clearAuthSession, getAuthUser, isAuthenticated } from "@/utils/auth";

type RoleRouteProps = {
  allowedRoles: AuthUserRole[];
  children: ReactNode;
};

export const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  if (!isAuthenticated()) {
    clearAuthSession();
    return <Navigate replace to={routePaths.login} />;
  }

  const user = getAuthUser();

  if (!user) {
    clearAuthSession();
    return <Navigate replace to={routePaths.login} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to={routePaths.home} />;
  }

  return <>{children}</>;
};
