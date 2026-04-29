import { routePaths } from "@/routes/routePaths";
import type { Statistic } from "@/types/service.types";

type HeroSectionProps = {
  stats: Statistic[];
};

export const HeroSection = ({ stats }: HeroSectionProps) => {
  return (
    <section className="hero" id="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="eyebrow">Explore first, book when ready</span>
          <h1>Find trusted local help for home repairs.</h1>
          <p className="hero__copy">
            Browse popular services, compare verified providers, and sign in only when
            you are ready to request a booking.
          </p>

          <div className="hero__actions">
            <a className="button" href="#services">
              Browse services
            </a>
            <a className="button button--ghost" href={routePaths.login}>
              Log in to book
            </a>
          </div>

          <div className="hero__stats">
            {stats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-card" aria-label="Booking preview">
          <div className="hero-card__badge">Booking preview</div>
          <h2>See the service details before creating a request.</h2>
          <p>
            Public visitors can discover what is available. Booking, provider messaging,
            and appointment tracking continue after login.
          </p>

          <div className="hero-card__list">
            <div>
              <span>Browse</span>
              <strong>Categories and providers</strong>
            </div>
            <div>
              <span>Compare</span>
              <strong>Ratings, location and price</strong>
            </div>
            <div>
              <span>Continue</span>
              <strong>Log in to send a booking</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
