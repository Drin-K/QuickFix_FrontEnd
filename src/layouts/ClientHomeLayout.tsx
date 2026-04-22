import type { PropsWithChildren } from "react";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import "@/styles/components.css";

export const ClientHomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="page-shell page-shell--client-home" id="top">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
