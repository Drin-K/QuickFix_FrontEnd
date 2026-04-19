import { ServiceCard } from "@/components/public/ServiceCard";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminServicesPage } from "@/pages/admin/AdminServicesPage";
import { ClientServicesPage } from "@/pages/client/ClientServicesPage";
import { ProviderServicesPage } from "@/pages/provider/ProviderServicesPage";
import type { AuthUserRole } from "@/services/auth.service";
import { homeService } from "@/services/service.service";
import { getAuthUser, isAuthenticated } from "@/utils/auth";

const PublicServicesPage = () => {
  const categories = homeService.getServiceCategories();

  return (
    <PublicLayout>
      <section className="section services-page">
        <div className="container">
          <div className="services-page__hero">
            <span className="eyebrow">Marketplace services</span>
            <h1>Browse the main service categories available in QuickFix.</h1>
            <p>
              This page provides the basic listing structure for the marketplace so users
              can scan service categories and continue exploring the platform.
            </p>
          </div>

          <div className="services-page__summary">
            <div className="services-page__stat">
              <strong>{categories.length}</strong>
              <span>service categories</span>
            </div>
            <div className="services-page__stat">
              <strong>Basic listing</strong>
              <span>ready for backend expansion</span>
            </div>
            <div className="services-page__stat">
              <strong>Public route</strong>
              <span>configured in the frontend router</span>
            </div>
          </div>

          <div className="section-heading services-page__heading">
            <h2>Available services</h2>
            <p>
              Each card represents a service category that can later be extended with real
              marketplace search, filters, and provider-specific results.
            </p>
          </div>

          <div className="services-grid">
            {categories.map((category) => (
              <ServiceCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

const getRoleBasedServicesPage = (role: AuthUserRole | undefined) => {
  switch (role) {
    case "client":
      return <ClientServicesPage />;
    case "provider":
      return <ProviderServicesPage />;
    case "admin":
    case "platform_admin":
      return <AdminServicesPage />;
    default:
      return <PublicServicesPage />;
  }
};

export const ServicesPage = () => {
  const user = isAuthenticated() ? getAuthUser() : null;

  return getRoleBasedServicesPage(user?.role);
};
