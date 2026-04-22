import type { PropsWithChildren } from "react";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import "@/styles/components.css";

export const ClientLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="page-shell page-shell--client" id="top">
      <Navbar />
      <main>
        <section className="role-layout role-layout--client">
          <div className="container role-layout__inner">
            <div className="role-layout__intro">
              <span className="eyebrow">Client area</span>
              <h1>Your booking workspace</h1>
              <p>
                Keep client tools, reservations, and service activity in one dedicated
                place without mixing them with the public landing pages.
              </p>
            </div>
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
};
