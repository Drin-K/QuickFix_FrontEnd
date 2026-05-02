import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import { serviceService } from "@/services/service.service";
import type { ServiceApiListItem } from "@/types/service.types";
import { clearAuthSession } from "@/utils/auth";

export const MyServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceApiListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const activeServicesCount = useMemo(
    () => services.filter((service) => service.isActive).length,
    [services],
  );

  const handleAuthError = useCallback(
    (error: unknown): boolean => {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return true;
      }

      return false;
    },
    [navigate],
  );

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const providerServices = await serviceService.getMyServices();
      setServices(providerServices);
    } catch (error) {
      if (handleAuthError(error)) {
        return;
      }

      setServices([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load your services.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const handleDelete = async (serviceId: number) => {
    const shouldDelete = window.confirm("Delete this service from your listings?");

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await serviceService.remove(serviceId);
      setSuccessMessage("Service deleted successfully.");
      await loadServices();
    } catch (error) {
      if (handleAuthError(error)) {
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete service.",
      );
    }
  };

  return (
    <ProviderLayout>
      <section className="section my-services-page">
        <div className="container">
          <div className="my-services-hero">
            <div>
              <span className="eyebrow">My services</span>
              <h1>Manage the services you publish in the marketplace.</h1>
              <p>
                Review, edit, or remove the services attached to your provider profile.
              </p>
              <div className="my-services-hero__actions">
                <Link className="button" to={routePaths.providerServiceCreate}>
                  Create service
                </Link>
              </div>
            </div>
            <div
              className="my-services-hero__stats"
              aria-label="Provider service summary"
            >
              <article>
                <strong>{services.length}</strong>
                <span>Total listings</span>
              </article>
              <article>
                <strong>{activeServicesCount}</strong>
                <span>Active services</span>
              </article>
            </div>
          </div>

          <section className="my-services-list" aria-label="Your services">
            <div className="section-heading my-services-list__heading">
              <span className="eyebrow">Provider listings</span>
              <h2>Your current services</h2>
              <p>
                {isLoading
                  ? "Loading your provider services..."
                  : `${services.length} service(s) found for your provider account.`}
              </p>
            </div>

            {errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}
            {successMessage ? (
              <p className="auth-form__success">{successMessage}</p>
            ) : null}

            {!isLoading && services.length === 0 ? (
              <div className="my-services-empty">
                <h3>No services yet</h3>
                <p>Create your first service to make it available for customers.</p>
                <Link className="button" to={routePaths.providerServiceCreate}>
                  Create service
                </Link>
              </div>
            ) : null}

            <div className="my-services-cards">
              {services.map((service) => (
                <article key={service.id} className="my-service-card">
                  <div className="my-service-card__header">
                    <div>
                      <span className="eyebrow">
                        {service.category?.name ?? "Uncategorized"}
                      </span>
                      <h3>{service.title}</h3>
                    </div>
                    <span
                      className={`my-service-card__status ${
                        service.isActive
                          ? "my-service-card__status--active"
                          : "my-service-card__status--inactive"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p>
                    {service.description ??
                      "No description has been added for this service yet."}
                  </p>

                  <div className="my-service-card__meta">
                    <strong>EUR {service.basePrice}</strong>
                    <span>
                      Updated {new Date(service.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="my-service-card__actions">
                    <Link
                      className="button button--ghost"
                      to={`${routePaths.providerServices}/${service.id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={() => void handleDelete(service.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </ProviderLayout>
  );
};
