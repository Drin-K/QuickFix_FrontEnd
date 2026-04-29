import type { ServiceCategory } from "@/types/service.types";
import { routePaths } from "@/routes/routePaths";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  category: ServiceCategory;
};

export const ServiceCard = ({ category }: ServiceCardProps) => {
  return (
    <Link className="service-card service-card--interactive" to={routePaths.login}>
      <article>
        <div className="service-card__icon" aria-hidden="true">
          {category.icon}
        </div>
        <h3>{category.title}</h3>
        <p>{category.description}</p>
        <span className="service-card__link">Log in to book</span>
      </article>
    </Link>
  );
};
