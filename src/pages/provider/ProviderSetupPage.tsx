import { type FormEvent, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import {
  getProviderSetupDraft,
  saveProviderSetupDraft,
  type ProviderProfileType,
  type ProviderSetupDraft,
} from "@/services/provider.service";

type ProviderOption = {
  type: ProviderProfileType;
  eyebrow: string;
  title: string;
  description: string;
};

type SetupFormState = {
  displayName: string;
  description: string;
  cityId: string;
  address: string;
  professionTitle: string;
  yearsOfExperience: string;
  bio: string;
  businessName: string;
  businessNumber: string;
  website: string;
  documentType: string;
  fileUrl: string;
};

const providerOptions: ProviderOption[] = [
  {
    type: "individual",
    eyebrow: "Individual",
    title: "Independent professional",
    description: "For masters, technicians, and specialists who work under their own name.",
  },
  {
    type: "company",
    eyebrow: "Company",
    title: "Service business",
    description: "For firms that operate under a business name or manage a service team.",
  },
];

const emptyFormState: SetupFormState = {
  displayName: "",
  description: "",
  cityId: "",
  address: "",
  professionTitle: "",
  yearsOfExperience: "",
  bio: "",
  businessName: "",
  businessNumber: "",
  website: "",
  documentType: "",
  fileUrl: "",
};

const getInitialFormState = (draft: ProviderSetupDraft | null): SetupFormState => ({
  ...emptyFormState,
  displayName: draft?.displayName ?? "",
  description: draft?.description ?? "",
  cityId: draft?.cityId ?? "",
  address: draft?.address ?? "",
  professionTitle: draft?.individualDetails?.professionTitle ?? "",
  yearsOfExperience: draft?.individualDetails?.yearsOfExperience ?? "",
  bio: draft?.individualDetails?.bio ?? "",
  businessName: draft?.companyDetails?.businessName ?? "",
  businessNumber: draft?.companyDetails?.businessNumber ?? "",
  website: draft?.companyDetails?.website ?? "",
  documentType: draft?.documents[0]?.documentType ?? "",
  fileUrl: draft?.documents[0]?.fileUrl ?? "",
});

export const ProviderSetupPage = () => {
  const existingDraft = useMemo(() => getProviderSetupDraft(), []);
  const [selectedType, setSelectedType] = useState<ProviderProfileType>(
    existingDraft?.type ?? "individual",
  );
  const [formValues, setFormValues] = useState<SetupFormState>(() =>
    getInitialFormState(existingDraft),
  );
  const [showSavedState, setShowSavedState] = useState(Boolean(existingDraft?.isSetupComplete));

  const selectedOption = providerOptions.find((option) => option.type === selectedType);
  const isCompany = selectedType === "company";

  const updateField = (field: keyof SetupFormState, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setShowSavedState(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const draft: ProviderSetupDraft = {
      type: selectedType,
      displayName: formValues.displayName.trim(),
      description: formValues.description.trim(),
      cityId: formValues.cityId.trim(),
      address: formValues.address.trim(),
      individualDetails:
        selectedType === "individual"
          ? {
              professionTitle: formValues.professionTitle.trim(),
              yearsOfExperience: formValues.yearsOfExperience.trim(),
              bio: formValues.bio.trim(),
            }
          : undefined,
      companyDetails:
        selectedType === "company"
          ? {
              businessName: formValues.businessName.trim(),
              businessNumber: formValues.businessNumber.trim(),
              website: formValues.website.trim(),
            }
          : undefined,
      documents:
        formValues.documentType.trim() || formValues.fileUrl.trim()
          ? [
              {
                documentType: formValues.documentType.trim(),
                fileUrl: formValues.fileUrl.trim(),
                isVerified: false,
              },
            ]
          : [],
      isSetupComplete: true,
      isVerified: false,
    };

    saveProviderSetupDraft(draft);
    setShowSavedState(true);
  };

  return (
    <ProviderLayout>
      <section className="section provider-setup">
        <div className="container">
          <div className="provider-setup__hero">
            <div>
              <span className="eyebrow">Provider setup</span>
              <h1>Prepare your profile before verification.</h1>
              <p>
                Select whether you operate as an individual or company, then add the details
                that map to the provider profile, detail tables, and verification documents.
              </p>
            </div>
            <div className="provider-setup__progress" aria-label="Provider setup progress">
              <span className="is-active">1. Profile type</span>
              <span className="is-active">2. Provider details</span>
              <span className={showSavedState ? "is-active" : undefined}>3. Verification pending</span>
            </div>
          </div>

          <form className="provider-setup-form" onSubmit={handleSubmit}>
            <section className="provider-setup-section">
              <div className="provider-setup-section__header">
                <span className="eyebrow">Profile type</span>
                <h2>How do you provide services?</h2>
              </div>

              <div className="provider-setup__options" role="radiogroup" aria-label="Provider type">
                {providerOptions.map((option) => {
                  const isSelected = selectedType === option.type;

                  return (
                    <button
                      aria-checked={isSelected}
                      className={
                        isSelected
                          ? "provider-setup-option provider-setup-option--selected"
                          : "provider-setup-option"
                      }
                      key={option.type}
                      role="radio"
                      type="button"
                      onClick={() => {
                        setSelectedType(option.type);
                        setShowSavedState(false);
                      }}
                    >
                      <span className="provider-setup-option__eyebrow">{option.eyebrow}</span>
                      <strong>{option.title}</strong>
                      <p>{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="provider-setup-section">
              <div className="provider-setup-section__header">
                <span className="eyebrow">Provider profile</span>
                <h2>Basic public details</h2>
                <p>These fields match the shared provider profile clients will see.</p>
              </div>

              <div className="provider-setup-details__grid">
                <label className="auth-form__field">
                  <span>Display name</span>
                  <input
                    className="auth-form__input"
                    required
                    value={formValues.displayName}
                    onChange={(event) => updateField("displayName", event.target.value)}
                    placeholder={isCompany ? "QuickFix Plumbing LLC" : "Arber Kola"}
                  />
                </label>
                <label className="auth-form__field">
                  <span>City ID</span>
                  <input
                    className="auth-form__input"
                    value={formValues.cityId}
                    onChange={(event) => updateField("cityId", event.target.value)}
                    placeholder="Example: 1"
                  />
                </label>
                <label className="auth-form__field">
                  <span>Address</span>
                  <input
                    className="auth-form__input"
                    value={formValues.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Street, city"
                  />
                </label>
                <label className="auth-form__field provider-setup-details__wide">
                  <span>Description</span>
                  <textarea
                    className="auth-form__input provider-setup-details__textarea"
                    value={formValues.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Short summary of the services you provide"
                  />
                </label>
              </div>
            </section>

            <section className="provider-setup-section">
              <div className="provider-setup-section__header">
                <span className="eyebrow">{selectedOption?.eyebrow} details</span>
                <h2>{isCompany ? "Company information" : "Professional information"}</h2>
                <p>
                  {isCompany
                    ? "These fields align with provider_company_details."
                    : "These fields align with provider_individual_details."}
                </p>
              </div>

              {isCompany ? (
                <div className="provider-setup-details__grid">
                  <label className="auth-form__field">
                    <span>Business name</span>
                    <input
                      className="auth-form__input"
                      required
                      value={formValues.businessName}
                      onChange={(event) => updateField("businessName", event.target.value)}
                      placeholder="Registered business name"
                    />
                  </label>
                  <label className="auth-form__field">
                    <span>Business number</span>
                    <input
                      className="auth-form__input"
                      value={formValues.businessNumber}
                      onChange={(event) => updateField("businessNumber", event.target.value)}
                      placeholder="Optional"
                    />
                  </label>
                  <label className="auth-form__field">
                    <span>Website</span>
                    <input
                      className="auth-form__input"
                      value={formValues.website}
                      onChange={(event) => updateField("website", event.target.value)}
                      placeholder="https://example.com"
                    />
                  </label>
                </div>
              ) : (
                <div className="provider-setup-details__grid">
                  <label className="auth-form__field">
                    <span>Profession title</span>
                    <input
                      className="auth-form__input"
                      required
                      value={formValues.professionTitle}
                      onChange={(event) => updateField("professionTitle", event.target.value)}
                      placeholder="Certified electrician"
                    />
                  </label>
                  <label className="auth-form__field">
                    <span>Years of experience</span>
                    <input
                      className="auth-form__input"
                      min="0"
                      type="number"
                      value={formValues.yearsOfExperience}
                      onChange={(event) => updateField("yearsOfExperience", event.target.value)}
                      placeholder="5"
                    />
                  </label>
                  <label className="auth-form__field provider-setup-details__wide">
                    <span>Bio</span>
                    <textarea
                      className="auth-form__input provider-setup-details__textarea"
                      value={formValues.bio}
                      onChange={(event) => updateField("bio", event.target.value)}
                      placeholder="Experience, specialties, and how you work with clients"
                    />
                  </label>
                </div>
              )}
            </section>

            <section className="provider-setup-section">
              <div className="provider-setup-section__header">
                <span className="eyebrow">Verification documents</span>
                <h2>Prepare documents for the next verification step.</h2>
                <p>
                  Upload and verification will be wired later. For now this keeps the frontend
                  shape aligned with provider_documents.
                </p>
              </div>

              <div className="provider-setup-details__grid">
                <label className="auth-form__field">
                  <span>Document type</span>
                  <input
                    className="auth-form__input"
                    value={formValues.documentType}
                    onChange={(event) => updateField("documentType", event.target.value)}
                    placeholder={isCompany ? "business_registration" : "license"}
                  />
                </label>
                <label className="auth-form__field provider-setup-details__wide">
                  <span>File URL</span>
                  <input
                    className="auth-form__input"
                    value={formValues.fileUrl}
                    onChange={(event) => updateField("fileUrl", event.target.value)}
                    placeholder="Document URL placeholder"
                  />
                </label>
              </div>
            </section>

            {showSavedState ? (
              <div className="provider-setup-verification">
                <span>Setup saved</span>
                <strong>Your provider profile is ready, but not verified yet.</strong>
                <p>
                  The verification flow will be added later. Until then, your profile details
                  stay prepared for backend integration.
                </p>
              </div>
            ) : null}

            <div className="provider-setup__actions">
              <button className="button" type="submit">
                Save provider setup
              </button>
              <NavLink className="button button--ghost" to={routePaths.providerHome}>
                Back to provider home
              </NavLink>
            </div>
          </form>
        </div>
      </section>
    </ProviderLayout>
  );
};
