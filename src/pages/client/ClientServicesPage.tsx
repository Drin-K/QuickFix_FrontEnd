import { ServicesOverviewSection } from "@/components/services/ServicesOverviewSection";
import { ClientLayout } from "@/layouts/ClientLayout";

const clientServices = [
  {
    title: "Electrical Repairs",
    description: "Browse available electricians, compare offers, and continue to booking.",
    meta: "Booking-ready category",
    status: "Available now",
  },
  {
    title: "Plumbing Support",
    description: "Find plumbing services and review options before confirming a booking.",
    meta: "Popular with urgent requests",
    status: "Available now",
  },
  {
    title: "Home Care",
    description: "Explore maintenance services suited for routine jobs around the home.",
    meta: "Recurring service option",
    status: "Available this week",
  },
];

export const ClientServicesPage = () => {
  return (
    <ClientLayout>
      <ServicesOverviewSection
        eyebrow="Client services"
        title="Choose services you want to book as a client."
        description="Clients see a booking-focused services area with the categories they can explore and reserve."
        records={clientServices}
      />
    </ClientLayout>
  );
};
