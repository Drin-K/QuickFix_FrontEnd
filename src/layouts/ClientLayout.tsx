import type { PropsWithChildren } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";

export const ClientLayout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>;
};
