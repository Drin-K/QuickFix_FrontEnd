import type { PropsWithChildren } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "@/styles/home.css";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="page-shell">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
