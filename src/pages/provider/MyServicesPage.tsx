import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import { getCategories, serviceService } from "@/services/service.service";
import type {
  ServiceApiCategory,
  ServiceApiListItem,
  ServiceMutationPayload,
} from "@/types/service.types";
import { clearAuthSession } from "@/utils/auth";

type ServiceFormState = {
  title: string;
  description: string;
  basePrice: string;
  categoryId: string;
  isActive: boolean;
};

const emptyForm: ServiceFormState = {
  title: "",
  description: "",
  basePrice: "",
  categoryId: "",
  isActive: true,
};

const toFormState = (service: ServiceApiListItem): ServiceFormState => ({
  title: service.title,
  description: service.description ?? "",
  basePrice: service.basePrice,
  categoryId: service.category?.id ? String(service.category.id) : "",
  isActive: service.isActive,
});

const toPayload = (form: ServiceFormState): ServiceMutationPayload => ({
  title: form.title.trim(),
  description: form.description.trim() || null,
  basePrice: form.basePrice.trim(),
  categoryId: form.categoryId ? Number(form.categoryId) : null,
  isActive: form.isActive,
});

export const MyServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceApiListItem[]>([]);
  const [categories, setCategories] = useState<ServiceApiCategory[]>([]);
  const [form, setForm] = useState<ServiceFormState>(emptyForm);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const activeServicesCount = useMemo(
    () => services.filter((service) => service.isActive).length,
    [services],
  );

  const canSubmit = form.title.trim().length > 0 && form.basePrice.trim().length > 0;

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
      const [providerServices, categoriesResponse] = await Promise.all([
        serviceService.getMyServices(),
        getCategories().catch(() => ({ categories: [] })),
      ]);

      setServices(providerServices);
      setCategories(categoriesResponse.categories);
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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingServiceId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!canSubmit) {
      setErrorMessage("Title and base price are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = toPayload(form);

      if (editingServiceId) {
        await serviceService.update(editingServiceId, payload);
        setSuccessMessage("Service updated successfully.");
      } else {
        await serviceService.create(payload);
        setSuccessMessage("Service created successfully.");
      }

      resetForm();
      await loadServices();
    } catch (error) {
      if (handleAuthError(error)) {
        return;
      }

      setErrorMessage(error instanceof Error ? error.message : "Failed to save service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: ServiceApiListItem) => {
    setForm(toFormState(service));
    setEditingServiceId(service.id);
    setSuccessMessage("");
    setErrorMessage("");
  };

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

      if (editingServiceId === serviceId) {
        resetForm();
      }

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
                Create, update, deactivate, or remove the services attached to your
                provider profile.
              </p>
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

          <div className="my-services-grid">
            <section
              className="auth-card my-services-form-card"
              aria-labelledby="service-form-title"
            >
              <div className="auth-card__header">
                <h2 id="service-form-title">
                  {editingServiceId ? "Edit service" : "Create service"}
                </h2>
                <p>
                  Keep title, category, price, and visibility ready for customers browsing
                  your tenant.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <label className="auth-form__field">
                  <span>Title</span>
                  <input
                    className="auth-form__input"
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Electrical repair"
                    required
                  />
                </label>

                <label className="auth-form__field">
                  <span>Category</span>
                  <select
                    className="auth-form__input"
                    value={form.categoryId}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        categoryId: event.target.value,
                      }))
                    }
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="auth-form__field">
                  <span>Base price</span>
                  <input
                    className="auth-form__input"
                    value={form.basePrice}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        basePrice: event.target.value,
                      }))
                    }
                    placeholder="25.00"
                    required
                  />
                </label>

                <label className="auth-form__field">
                  <span>Description</span>
                  <textarea
                    className="auth-form__input my-services-form-card__textarea"
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Describe what customers can book."
                  />
                </label>

                <label className="auth-form__checkbox">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        isActive: event.target.checked,
                      }))
                    }
                  />
                  <span>Visible to customers</span>
                </label>

                {errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}
                {successMessage ? (
                  <p className="auth-form__success">{successMessage}</p>
                ) : null}

                <div className="my-services-form-card__actions">
                  <button
                    className="button"
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingServiceId
                        ? "Save changes"
                        : "Create service"}
                  </button>
                  {editingServiceId ? (
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

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

              {!isLoading && services.length === 0 ? (
                <div className="my-services-empty">
                  <h3>No services yet</h3>
                  <p>Create your first service with the form on this page.</p>
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
                      <button
                        className="button button--ghost"
                        type="button"
                        onClick={() => handleEdit(service)}
                      >
                        Edit
                      </button>
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
        </div>
      </section>
    </ProviderLayout>
  );
};
