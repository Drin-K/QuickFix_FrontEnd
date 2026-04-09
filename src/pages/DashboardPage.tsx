import { PagePlaceholder } from "@/components/PagePlaceholder";
import { MainLayout } from "@/layouts/MainLayout";

export const DashboardPage = () => {
  return (
    <MainLayout>
      <PagePlaceholder
        eyebrow="Dashboard"
        title="Manage bookings, requests and provider activity."
        description="This page will become the main dashboard for users to track services, messages, and upcoming jobs."
      />
    </MainLayout>
  );
};
