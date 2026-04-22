import type { PropsWithChildren } from "react";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import "@/styles/components.css";

export const ProviderHomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="page-shell page-shell--provider-home" id="top">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
