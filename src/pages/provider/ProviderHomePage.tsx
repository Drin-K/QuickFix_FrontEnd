import { NavLink } from "react-router-dom";
import { ProviderHomeLayout } from "@/layouts/ProviderHomeLayout";
import { routePaths } from "@/routes/routePaths";

export const ProviderHomePage = () => {
  return (
    <ProviderHomeLayout>
      <section className="section role-home role-home--provider">
        <div className="container">
          <div className="role-home__hero">
            <div className="section-heading">
              <span className="eyebrow">Provider home</span>
              <h1 className="page-placeholder__title">Grow your service business on QuickFix.</h1>
              <p>
                This provider homepage works as a public entry point, while provider
                management tools stay in the authenticated provider layout.
              </p>
            </div>

            <div className="page-placeholder__card role-home__card">
              <strong>Why providers start here</strong>
              <ul className="role-home__list">
                <li>Showcase availability before users enter the dashboard.</li>
                <li>Guide new partners toward onboarding and sign-in.</li>
                <li>Keep service management pages separated behind authentication.</li>
              </ul>
              <div className="page-placeholder__actions">
                <NavLink className="button" to={routePaths.register}>
                  Become a provider
                </NavLink>
                <NavLink className="button button--ghost" to={routePaths.login}>
                  Provider login
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProviderHomeLayout>
  );
};
