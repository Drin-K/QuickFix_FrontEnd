import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return <AuthProvider>{children}</AuthProvider>;
};
