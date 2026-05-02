import { useMemo, useState } from "react";
import type { ServiceApiCategory, ServiceMutationPayload } from "@/types/service.types";

export type ProviderServiceFormState = {
  title: string;
  description: string;
  basePrice: string;
  categoryId: string;
  isActive: boolean;
};

const emptyProviderServiceForm: ProviderServiceFormState = {
  title: "",
  description: "",
  basePrice: "",
  categoryId: "",
  isActive: true,
};

const toServiceMutationPayload = (
  form: ProviderServiceFormState,
): ServiceMutationPayload => ({
  title: form.title.trim(),
  description: form.description.trim() || null,
  basePrice: form.basePrice.trim(),
  categoryId: form.categoryId ? Number(form.categoryId) : null,
  isActive: form.isActive,
});

type ProviderServiceFormProps = {
  categories: ServiceApiCategory[];
  initialValue?: ProviderServiceFormState;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  successMessage?: string;
  onCancel?: () => void;
  onSubmit: (payload: ServiceMutationPayload) => Promise<void>;
};

export const ProviderServiceForm = ({
  categories,
  initialValue = emptyProviderServiceForm,
  submitLabel,
  submittingLabel,
  isSubmitting,
  errorMessage,
  successMessage,
  onCancel,
  onSubmit,
}: ProviderServiceFormProps) => {
  const [form, setForm] = useState<ProviderServiceFormState>(initialValue);

  const canSubmit = useMemo(
    () => form.title.trim().length > 0 && form.basePrice.trim().length > 0,
    [form.basePrice, form.title],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    await onSubmit(toServiceMutationPayload(form));
  };

  return (
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
            setForm((current) => ({ ...current, categoryId: event.target.value }))
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
            setForm((current) => ({ ...current, basePrice: event.target.value }))
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
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Describe what customers can book."
        />
      </label>

      <label className="auth-form__checkbox">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) =>
            setForm((current) => ({ ...current, isActive: event.target.checked }))
          }
        />
        <span>Visible to customers</span>
      </label>

      {errorMessage ? <p className="auth-form__error">{errorMessage}</p> : null}
      {successMessage ? <p className="auth-form__success">{successMessage}</p> : null}

      <div className="my-services-form-card__actions">
        <button className="button" type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
        {onCancel ? (
          <button className="button button--ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};
