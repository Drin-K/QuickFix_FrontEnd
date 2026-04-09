import { PagePlaceholder } from "@/components/PagePlaceholder";
import { MainLayout } from "@/layouts/MainLayout";

export const RegisterPage = () => {
  return (
    <MainLayout>
      <PagePlaceholder
        eyebrow="Register"
        title="Create a new QuickFix account."
        description="This page will host registration for customers, service providers, and company accounts."
      />
    </MainLayout>
  );
};
