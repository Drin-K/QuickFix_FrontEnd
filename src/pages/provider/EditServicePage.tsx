import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/api/api";
import {
  ProviderServiceForm,
  type ProviderServiceFormState,
} from "@/components/services/ProviderServiceForm";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import { getCategories, serviceService } from "@/services/service.service";
import type {
  ServiceApiCategory,
  ServiceApiDetails,
  ServiceApiListItem,
  ServiceMutationPayload,
} from "@/types/service.types";
import { clearAuthSession } from "@/utils/auth";

const toFormState = (
  service: ServiceApiListItem | ServiceApiDetails,
): ProviderServiceFormState => ({
  title: service.title,
  description: service.description ?? "",
  basePrice: service.basePrice,
  categoryId: service.category?.id ? String(service.category.id) : "",
  isActive: service.isActive,
});

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<ServiceApiCategory[]>([]);
  const [initialValue, setInitialValue] = useState<ProviderServiceFormState | null>(null);
  const [serviceTitle, setServiceTitle] = useState("Service");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const serviceId = Number(id);
  const hasValidServiceId = Number.isInteger(serviceId) && serviceId > 0;

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

  useEffect(() => {
    if (!hasValidServiceId) {
      setErrorMessage("Invalid service id.");
      setIsLoading(false);
      return;
    }

    const loadService = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [service, categoriesResponse] = await Promise.all([
          serviceService.getMyService(serviceId),
          getCategories().catch(() => ({ categories: [] })),
        ]);

        setInitialValue(toFormState(service));
        setServiceTitle(service.title);
        setCategories(categoriesResponse.categories);
      } catch (error) {
        if (handleAuthError(error)) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load service.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadService();
  }, [handleAuthError, hasValidServiceId, serviceId]);

  const handleSubmit = async (payload: ServiceMutationPayload) => {
    if (!hasValidServiceId) {
      setErrorMessage("Invalid service id.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await serviceService.update(serviceId, payload);
      setSuccessMessage("Service updated successfully.");
      navigate(routePaths.providerServices);
    } catch (error) {
      if (handleAuthError(error)) {
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update service.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProviderLayout>
      <section className="section my-services-page">
        <div className="container">
          <div className="my-services-hero">
            <div>
              <span className="eyebrow">Edit service</span>
              <h1>Update {serviceTitle}.</h1>
              <p>
                Keep pricing, category, description, and visibility aligned with your
                offer.
              </p>
            </div>
          </div>

          <section className="auth-card my-services-form-card my-services-form-card--standalone">
            <div className="auth-card__header">
              <h2>Service details</h2>
              <p>
                {isLoading
                  ? "Loading service details..."
                  : "Review the current values and save the updated service."}
              </p>
            </div>

            {isLoading ? <p>Loading service...</p> : null}

            {!isLoading && !initialValue ? (
              <p className="auth-form__error">
                {errorMessage || "We could not find this provider service."}
              </p>
            ) : null}

            {initialValue ? (
              <ProviderServiceForm
                key={serviceId}
                categories={categories}
                initialValue={initialValue}
                submitLabel="Save changes"
                submittingLabel="Saving..."
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
                successMessage={successMessage}
                onCancel={() => navigate(routePaths.providerServices)}
                onSubmit={handleSubmit}
              />
            ) : null}
          </section>
        </div>
      </section>
    </ProviderLayout>
  );
};
