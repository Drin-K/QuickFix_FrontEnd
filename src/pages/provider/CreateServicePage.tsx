import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { ProviderServiceForm } from "@/components/services/ProviderServiceForm";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import {
  getProviderVerificationStatus,
  type ProviderVerificationStatus,
} from "@/services/provider.service";
import { getCategories, serviceService } from "@/services/service.service";
import type { ServiceApiCategory, ServiceMutationPayload } from "@/types/service.types";
import { clearAuthSession } from "@/utils/auth";

export const CreateServicePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationStatus, setVerificationStatus] =
    useState<ProviderVerificationStatus | null>(null);

  const requiresVerification =
    verificationStatus !== null && !verificationStatus.isVerified;
  const verificationMessage =
    "Provider verification is required before creating or publishing services. Complete setup and document verification first.";

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
    const loadCategories = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [categoriesResponse, statusResponse] = await Promise.all([
          getCategories(),
          getProviderVerificationStatus(),
        ]);
        setCategories(categoriesResponse.categories);
        setVerificationStatus(statusResponse);
      } catch (error) {
        if (handleAuthError(error)) {
          return;
        }

        setCategories([]);
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load service categories.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategories();
  }, [handleAuthError]);

  const handleSubmit = async (payload: ServiceMutationPayload) => {
    if (requiresVerification) {
      setErrorMessage(verificationMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await serviceService.create(payload);
      setSuccessMessage("Service created successfully.");
      navigate(routePaths.providerServices);
    } catch (error) {
      if (handleAuthError(error)) {
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create service.",
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
              <span className="eyebrow">Create service</span>
              <h1>Add a new service to your provider listings.</h1>
              <p>
                Fill in the core details customers need before they book this service.
              </p>
            </div>
          </div>

          <section className="auth-card my-services-form-card my-services-form-card--standalone">
            <div className="auth-card__header">
              <h2>Service details</h2>
              <p>
                {isLoading
                  ? "Loading categories..."
                  : "Choose a category, set a base price, and publish when ready."}
              </p>
            </div>

            {requiresVerification ? (
              <div className="provider-setup-verification">
                <span>Verification required</span>
                <strong>Verify your provider profile before creating services.</strong>
                <p>{verificationMessage}</p>
                <Link
                  className="workspace-card-link"
                  to={routePaths.providerVerification}
                >
                  Go to verification
                </Link>
              </div>
            ) : null}

            <ProviderServiceForm
              categories={categories}
              submitLabel="Create service"
              submittingLabel="Creating..."
              isSubmitting={isSubmitting}
              isSubmitDisabled={requiresVerification}
              submitDisabledMessage={
                requiresVerification ? verificationMessage : undefined
              }
              errorMessage={errorMessage}
              successMessage={successMessage}
              onCancel={() => navigate(routePaths.providerServices)}
              onSubmit={handleSubmit}
            />
          </section>
        </div>
      </section>
    </ProviderLayout>
  );
};
