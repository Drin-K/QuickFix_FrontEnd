import type { ReactNode } from "react";

type PublicRouteProps = {
  children: ReactNode;
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
  return <>{children}</>;
};
