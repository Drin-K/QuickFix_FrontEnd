import { PagePlaceholder } from "@/components/PagePlaceholder";
import { AuthLayout } from "@/layouts/AuthLayout";

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <PagePlaceholder
        eyebrow="Register"
        title="Create a new QuickFix account."
        description="This page will host registration for customers, service providers, and company accounts."
      />
    </AuthLayout>
  );
};
