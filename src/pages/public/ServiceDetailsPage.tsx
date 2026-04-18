import { PublicLayout } from "@/layouts/PublicLayout";
import { homeService } from "@/services/service.service";
import { Link, useParams } from "react-router-dom";

export const ServiceDetailsPage = () => {
  const { id } = useParams();
  const service = id ? homeService.getServiceById(id) : undefined;

  if (!service) {
    return (
      <PublicLayout>
        <section className="section service-details">
          <div className="container">
            <div className="service-details__panel">
              <span className="eyebrow">Service not found</span>
              <h1>We could not find the service you requested.</h1>
              <p>The selected service may not exist yet, or the link may be incomplete.</p>
              <Link className="button" to="/">
                Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="section service-details">
        <div className="container">
          <div className="service-details__hero">
            <div>
              <span className="eyebrow">{service.category}</span>
              <div className="service-details__icon" aria-hidden="true">
                {service.icon}
              </div>
              <h1>{service.title}</h1>
              <p>{service.description}</p>
            </div>

            <div className="service-details__stats">
              <div className="service-details__meta-card">
                <h2>Provider</h2>
                <strong>{service.provider}</strong>
                <p>{service.responseTime}</p>
              </div>

              <div className="service-details__meta-card">
                <h2>Pricing</h2>
                <strong>{service.price}</strong>
                <p>{service.availability}</p>
              </div>
            </div>
          </div>

          <div className="service-details__content">
            <div className="service-details__panel">
              <h2>What is included</h2>
              <p>
                This page is ready to show service-specific information and can later be connected
                to the real API without changing the route structure.
              </p>
              <ul className="service-details__highlights">
                {service.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <aside className="service-details__sidebar">
              <div className="service-details__meta-card">
                <h2>Service summary</h2>
                <div className="service-details__meta-list">
                  <div>
                    <strong>Location</strong>
                    <span>{service.location}</span>
                  </div>
                  <div>
                    <strong>Category</strong>
                    <span>{service.category}</span>
                  </div>
                  <div>
                    <strong>Status</strong>
                    <span>{service.availability}</span>
                  </div>
                </div>
              </div>

              <Link className="button" to="/login">
                Continue to booking
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
