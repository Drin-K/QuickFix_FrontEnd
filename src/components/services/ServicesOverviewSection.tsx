type ServiceRecord = {
  title: string;
  description: string;
  meta: string;
  status: string;
};

type ServicesOverviewSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  records: ServiceRecord[];
};

export const ServicesOverviewSection = ({
  eyebrow,
  title,
  description,
  records,
}: ServicesOverviewSectionProps) => {
  return (
    <section className="section services-page">
      <div className="container">
        <div className="services-page__hero">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="services-page__summary">
          {records.map((record) => (
            <article key={record.title} className="services-page__stat">
              <strong>{record.title}</strong>
              <span>{record.description}</span>
              <span className="services-page__meta">{record.meta}</span>
              <span className="services-page__status">{record.status}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export type { ServiceRecord };
