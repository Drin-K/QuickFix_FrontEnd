import { ServicesOverviewSection } from "@/components/services/ServicesOverviewSection";
import { ProviderLayout } from "@/layouts/ProviderLayout";

const providerServices = [
  {
    title: "My active services",
    description: "Review the services currently visible to customers in the marketplace.",
    meta: "3 active listings",
    status: "Published",
  },
  {
    title: "Draft services",
    description: "Continue setting up services before making them available to clients.",
    meta: "1 draft pending completion",
    status: "Needs action",
  },
  {
    title: "Pricing and availability",
    description: "Update base pricing, working hours, and booking availability per service.",
    meta: "Management area",
    status: "Up to date",
  },
];

export const ProviderServicesPage = () => {
  return (
    <ProviderLayout>
      <ServicesOverviewSection
        eyebrow="Provider services"
        title="Manage the services you publish in the marketplace."
        description="Providers see a management-focused page for active listings, drafts, and pricing readiness."
        records={providerServices}
      />
    </ProviderLayout>
  );
};
