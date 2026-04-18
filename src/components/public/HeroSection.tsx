import type { Statistic } from "@/types/service.types";

type HeroSectionProps = {
  stats: Statistic[];
};

export const HeroSection = ({ stats }: HeroSectionProps) => {
  return (
    <section className="hero" id="hero">
      <div className="container hero__grid">
        <div>
          <span className="eyebrow">Fast local help for every repair</span>
          <h1>Book trusted home service professionals in just a few clicks.</h1>
          <p className="hero__copy">
            QuickFix helps customers discover electricians, plumbers and maintenance teams,
            compare ratings, and schedule service with confidence.
          </p>

          <div className="hero__actions">
            <a className="button" href="#services">
              Explore services
            </a>
            <a className="button button--ghost" href="#how-it-works">
              How it works
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

        <aside className="hero-card">
          <div className="hero-card__badge">AI Powered Matchmaking</div>
          <h2>Quick suggestions based on urgency, location and ratings.</h2>
          <p>
            Customers receive smarter provider suggestions while businesses manage new
            requests from one streamlined dashboard.
          </p>

          <div className="hero-card__list">
            <div>
              <span>Response time</span>
              <strong>Under 15 min</strong>
            </div>
            <div>
              <span>Top match</span>
              <strong>Best rated nearby pro</strong>
            </div>
            <div>
              <span>Trust signals</span>
              <strong>Reviews, badges, verified profiles</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
