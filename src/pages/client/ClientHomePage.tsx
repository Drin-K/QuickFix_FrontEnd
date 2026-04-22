import { NavLink } from "react-router-dom";
import { ClientHomeLayout } from "@/layouts/ClientHomeLayout";
import { routePaths } from "@/routes/routePaths";

export const ClientHomePage = () => {
  return (
    <ClientHomeLayout>
      <section className="section role-home role-home--client">
        <div className="container">
          <div className="role-home__hero">
            <div className="section-heading">
              <span className="eyebrow">Client home</span>
              <h1 className="page-placeholder__title">Book trusted help with less friction.</h1>
              <p>
                This page is now a public-facing client landing page, while the secure
                client workspace stays inside the private client layout.
              </p>
            </div>

            <div className="page-placeholder__card role-home__card">
              <strong>What clients can do next</strong>
              <ul className="role-home__list">
                <li>Browse available services before signing in.</li>
                <li>Continue to booking once they are ready.</li>
                <li>Access bookings from the private client area after login.</li>
              </ul>
              <div className="page-placeholder__actions">
                <NavLink className="button" to={routePaths.services}>
                  Explore services
                </NavLink>
                <NavLink className="button button--ghost" to={routePaths.login}>
                  Client login
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientHomeLayout>
  );
};
