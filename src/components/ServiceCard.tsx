import type { ServiceCategory } from "@/types/home";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  category: ServiceCategory;
};

export const ServiceCard = ({ category }: ServiceCardProps) => {
  return (
    <Link className="service-card service-card--interactive" to={`/services/${category.id}`}>
      <article>
        <div className="service-card__icon" aria-hidden="true">
          {category.icon}
        </div>
        <h3>{category.title}</h3>
        <p>{category.description}</p>
        <span className="service-card__link">View details</span>
      </article>
    </Link>
  );
};
