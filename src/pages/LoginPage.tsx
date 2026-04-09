import { PagePlaceholder } from "@/components/PagePlaceholder";
import { AuthLayout } from "@/layouts/AuthLayout";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <PagePlaceholder
        eyebrow="Login"
        title="Sign in to continue with QuickFix."
        description="This page will contain the customer and provider login form, validation, and authentication flow."
      />
    </AuthLayout>
  );
};
