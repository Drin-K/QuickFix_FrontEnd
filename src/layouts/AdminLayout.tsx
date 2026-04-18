import type { PropsWithChildren } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";

export const AdminLayout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>;
};
