import { PagePlaceholder } from "@/components/PagePlaceholder";
import { MainLayout } from "@/layouts/MainLayout";

export const LoginPage = () => {
  return (
    <MainLayout>
      <PagePlaceholder
        eyebrow="Login"
        title="Sign in to continue with QuickFix."
        description="This page will contain the customer and provider login form, validation, and authentication flow."
      />
    </MainLayout>
  );
};
