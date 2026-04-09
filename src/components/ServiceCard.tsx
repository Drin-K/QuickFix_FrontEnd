import type { ServiceCategory } from "@/types/home";

type ServiceCardProps = {
  category: ServiceCategory;
};

export const ServiceCard = ({ category }: ServiceCardProps) => {
  return (
    <article className="service-card">
      <div className="service-card__icon" aria-hidden="true">
        {category.icon}
      </div>
      <h3>{category.title}</h3>
      <p>{category.description}</p>
    </article>
  );
};
