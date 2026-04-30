import { formatRating } from "@/utils/format";
import type { ProviderHighlight } from "@/types/service.types";

type ProvidersSectionProps = {
  providers: ProviderHighlight[];
};

export const ProvidersSection = ({ providers }: ProvidersSectionProps) => {
  return (
    <section className="section" id="providers">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Featured providers</span>
          <h2>Reliable professionals visitors can discover before signing in.</h2>
          <p>
            Show enough trust signals on the public page to help clients decide, then move
            protected actions into the logged-in booking experience.
          </p>
        </div>

        <div className="providers-grid">
          {providers.map((provider) => (
            <article key={provider.name} className="provider-card">
              <div className="provider-card__avatar">{provider.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <h3>{provider.name}</h3>
                <p>{provider.specialty}</p>
              </div>
              <div className="provider-card__meta">
                <span>{provider.city}</span>
                <strong>{formatRating(provider.rating)} rating</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
