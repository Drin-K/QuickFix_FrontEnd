import { PagePlaceholder } from "@/components/common/PagePlaceholder";
import { ClientLayout } from "@/layouts/ClientLayout";

export const DashboardPage = () => {
  return (
    <ClientLayout>
      <PagePlaceholder
        eyebrow="Dashboard"
        title="Manage bookings, requests and provider activity."
        description="This page will become the main dashboard for users to track services, messages, and upcoming jobs."
      />
    </ClientLayout>
  );
};
