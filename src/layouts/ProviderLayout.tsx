import type { PropsWithChildren } from "react";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import "@/styles/components.css";

export const ProviderLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="page-shell page-shell--provider" id="top">
      <Navbar />
      <main>
        <section className="role-layout role-layout--provider">
          <div className="container role-layout__inner">
            <div className="role-layout__intro">
              <span className="eyebrow">Provider area</span>
              <h1>Manage your services and demand</h1>
              <p>
                This workspace is reserved for provider operations, listings, and client
                activity after sign-in.
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
