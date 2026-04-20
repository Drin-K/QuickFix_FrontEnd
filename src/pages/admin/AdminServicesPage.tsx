import { ServicesOverviewSection } from "@/components/services/ServicesOverviewSection";
import { AdminLayout } from "@/layouts/AdminLayout";

const adminServices = [
  {
    title: "Marketplace overview",
    description: "Monitor all service categories and verify what is visible across tenants.",
    meta: "System-wide visibility",
    status: "Healthy",
  },
  {
    title: "Review flagged services",
    description: "Inspect services that may require moderation, edits, or deactivation.",
    meta: "Moderation queue",
    status: "2 pending review",
  },
  {
    title: "Category governance",
    description: "Keep category structure aligned and prepare the next admin management flow.",
    meta: "Admin control area",
    status: "In progress",
  },
];

export const AdminServicesPage = () => {
  return (
    <AdminLayout>
      <ServicesOverviewSection
        eyebrow="Admin services"
        title="Monitor services across the marketplace."
        description="Admins see a system-level overview for moderation, governance, and service visibility."
        records={adminServices}
      />
    </AdminLayout>
  );
};
