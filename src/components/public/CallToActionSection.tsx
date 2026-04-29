import { routePaths } from "@/routes/routePaths";
import { Link } from "react-router-dom";

export const CallToActionSection = () => {
  return (
    <section className="section">
      <div className="container cta-banner">
        <div>
          <span className="eyebrow">Ready to continue</span>
          <h2>Create an account when you are ready to book or offer services.</h2>
          <p>
            Clients can request trusted help, while providers can register and manage their
            service profile from one place.
          </p>
        </div>
        <div className="cta-banner__actions">
          <Link className="button button--light" to={routePaths.register}>
            Sign up
          </Link>
          <Link className="button button--outline-light" to={routePaths.login}>
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
};
