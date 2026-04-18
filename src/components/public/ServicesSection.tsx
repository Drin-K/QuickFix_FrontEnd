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
          <h2>Everything customers need for home repairs and maintenance.</h2>
          <p>
            Search by category, compare trusted providers, and reserve the right service for
            the job.
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
