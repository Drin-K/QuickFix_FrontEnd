import { ApiError } from "@/api/api";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ClientLayout } from "@/layouts/ClientLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import type { AuthUserRole } from "@/services/auth.service";
import { getServices } from "@/services/service.service";
import type { ServiceApiListItem } from "@/types/service.types";
import {
  getActiveTenantId,
  getAuthUser,
  isAuthenticated,
  setActiveTenantId,
} from "@/utils/auth";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ServicesPageContent = () => {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<ServiceApiListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tenantIdFromQuery = Number(searchParams.get("tenantId"));
    const tenantId =
      Number.isInteger(tenantIdFromQuery) && tenantIdFromQuery > 0
        ? tenantIdFromQuery
        : getActiveTenantId();

    if (!tenantId) {
      setServices([]);
      setErrorMessage(
        "Tenant context is missing. Open this page from a tenant-specific link or sign in first.",
      );
      setIsLoading(false);
      return;
    }

    setActiveTenantId(tenantId);

    const loadServices = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getServices({ tenantId });
        setServices(response.services);
      } catch (error) {
        setServices([]);

        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("We could not load services right now.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadServices();
  }, [searchParams]);

  if (isLoading) {
    return (
      <section className="section services-page">
        <div className="container">
          <div className="services-page__hero">
            <span className="eyebrow">Loading services</span>
            <h1>We are loading services for the current tenant.</h1>
            <p>Please wait a moment while the marketplace list is prepared.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section services-page">
      <div className="container">
        <div className="services-page__hero">
          <span className="eyebrow">Marketplace services</span>
          <h1>Browse real services available in the current QuickFix tenant.</h1>
          <p>
            This listing now reads live backend data from the tenant-scoped services
            endpoint and keeps details navigation in the same tenant context.
          </p>
        </div>

        <div className="services-page__summary">
          <div className="services-page__stat">
            <strong>{services.length}</strong>
            <span>active services</span>
          </div>
          <div className="services-page__stat">
            <strong>{services.filter((service) => service.provider !== null).length}</strong>
            <span>services with provider details</span>
          </div>
          <div className="services-page__stat">
            <strong>
              {new Set(
                services
                  .map((service) => service.category?.name)
                  .filter((categoryName): categoryName is string => Boolean(categoryName)),
              ).size}
            </strong>
            <span>categories in this tenant</span>
          </div>
        </div>

        <div className="section-heading services-page__heading">
          <h2>Available services</h2>
          <p>
            Each card is fetched from `GET /services` and limited to the currently active
            tenant.
          </p>
        </div>

        {errorMessage ? (
          <div className="services-page__hero" role="alert">
            <span className="eyebrow">Unable to load services</span>
            <h2>We could not show the services list.</h2>
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {!errorMessage && services.length === 0 ? (
          <div className="services-page__hero">
            <span className="eyebrow">No services yet</span>
            <h2>This tenant does not have active services available right now.</h2>
            <p>Check back later after providers publish services for this marketplace.</p>
          </div>
        ) : null}

        {!errorMessage && services.length > 0 ? (
          <div className="services-grid">
            {services.map((service) => (
              <Link
                key={service.id}
                className="service-card service-card--interactive"
                to={`${routePaths.services}/${service.id}?tenantId=${service.tenantId}`}
              >
                <article>
                  <div className="service-card__icon" aria-hidden="true">
                    {service.category?.name?.slice(0, 1) ?? "S"}
                  </div>
                  <h3>{service.title}</h3>
                  <p>
                    {service.description ??
                      "No description is available yet for this service."}
                  </p>
                  <span className="services-page__meta">
                    {service.provider?.displayName ?? "Provider information unavailable"}
                  </span>
                  <span className="services-page__status">
                    {service.category?.name ?? "Uncategorized"} · EUR {service.basePrice}
                  </span>
                  <span className="service-card__link">View service details</span>
                </article>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

const ServicesPageLayout = ({
  role,
  children,
}: PropsWithChildren<{ role: AuthUserRole | undefined }>) => {
  switch (role) {
    case "client":
      return <ClientLayout>{children}</ClientLayout>;
    case "provider":
      return <ProviderLayout>{children}</ProviderLayout>;
    case "admin":
    case "platform_admin":
      return <AdminLayout>{children}</AdminLayout>;
    default:
      return <PublicLayout>{children}</PublicLayout>;
  }
};

export const ServicesPage = () => {
  const user = isAuthenticated() ? getAuthUser() : null;

  return (
    <ServicesPageLayout role={user?.role}>
      <ServicesPageContent />
    </ServicesPageLayout>
  );
};
