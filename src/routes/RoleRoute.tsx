import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { routePaths } from "@/routes/routePaths";
import type { AuthUserRole } from "@/services/auth.service";
import { getAuthUser } from "@/utils/auth";

type RoleRouteProps = {
  allowedRoles: AuthUserRole[];
  children: ReactNode;
};

export const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const user = getAuthUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate replace to={routePaths.home} />;
  }

  return <>{children}</>;
};
