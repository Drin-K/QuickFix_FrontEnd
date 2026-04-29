import { ServiceCard } from "@/components/public/ServiceCard";
import type { ServiceCategory } from "@/types/service.types";

type ServicesSectionProps = {
  categories: ServiceCategory[];
};

export const ServicesSection = ({ categories }: ServicesSectionProps) => {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Popular services</span>
          <h2>Preview the work QuickFix can help you arrange.</h2>
          <p>
            Services stay visible on the public page so visitors can understand the
            marketplace before signing in. Booking actions continue through the auth flow.
          </p>
        </div>

        <div className="services-grid">
          {categories.map((category) => (
            <ServiceCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
