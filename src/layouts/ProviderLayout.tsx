import type { PropsWithChildren } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";

export const ProviderLayout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>;
};
