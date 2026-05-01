import { type FormEvent, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import {
  getProviderProfile,
  getProviderSetupDraft,
  saveProviderSetupDraft,
  setupProvider,
  type ProviderProfileType,
  type ProviderProfileResponse,
  type ProviderSetupDraft,
  type ProviderSetupPayload,
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
};

const providerOptions: ProviderOption[] = [
  {
    type: "individual",
    eyebrow: "Individual",
    title: "Independent professional",
    description:
      "For masters, technicians, and specialists who work under their own name.",
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
});

const getFormStateFromProfile = (profile: ProviderProfileResponse): SetupFormState => ({
  ...emptyFormState,
  displayName: profile.provider.displayName,
  description: profile.provider.description ?? "",
  cityId: profile.provider.cityId ? String(profile.provider.cityId) : "",
  address: profile.provider.address ?? "",
  professionTitle: profile.individualDetails?.professionTitle ?? "",
  yearsOfExperience:
    profile.individualDetails?.yearsOfExperience !== null &&
    profile.individualDetails?.yearsOfExperience !== undefined
      ? String(profile.individualDetails.yearsOfExperience)
      : "",
  bio: profile.individualDetails?.bio ?? "",
  businessName: profile.companyDetails?.businessName ?? "",
  businessNumber: profile.companyDetails?.businessNumber ?? "",
  website: profile.companyDetails?.website ?? "",
});

const parseOptionalNumber = (value: string): number | undefined => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};

export const ProviderSetupPage = () => {
  const existingDraft = useMemo(() => getProviderSetupDraft(), []);
  const [selectedType, setSelectedType] = useState<ProviderProfileType>(
    existingDraft?.type ?? "individual",
  );
  const [formValues, setFormValues] = useState<SetupFormState>(() =>
    getInitialFormState(existingDraft),
  );
  const [showSavedState, setShowSavedState] = useState(
    Boolean(existingDraft?.isSetupComplete),
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedOption = providerOptions.find((option) => option.type === selectedType);
  const isCompany = selectedType === "company";

  useEffect(() => {
    let isMounted = true;

    const loadProviderProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const profile = await getProviderProfile();

        if (!isMounted) {
          return;
        }

        setSelectedType(profile.provider.type);
        setFormValues(getFormStateFromProfile(profile));
        setShowSavedState(Boolean(profile.individualDetails || profile.companyDetails));
      } catch {
        if (isMounted && existingDraft?.isSetupComplete) {
          setShowSavedState(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadProviderProfile();

    return () => {
      isMounted = false;
    };
  }, [existingDraft]);

  const updateField = (field: keyof SetupFormState, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setShowSavedState(false);
    setFeedbackMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage("");
    setErrorMessage("");

    const cityId = parseOptionalNumber(formValues.cityId);
    const yearsOfExperience = parseOptionalNumber(formValues.yearsOfExperience);

    const payload: ProviderSetupPayload = {
      type: selectedType,
      displayName: formValues.displayName.trim(),
      description: formValues.description.trim() || undefined,
      cityId,
      address: formValues.address.trim() || undefined,
      individualDetails:
        selectedType === "individual"
          ? {
              professionTitle: formValues.professionTitle.trim(),
              yearsOfExperience,
              bio: formValues.bio.trim() || undefined,
            }
          : undefined,
      companyDetails:
        selectedType === "company"
          ? {
              businessName: formValues.businessName.trim(),
              businessNumber: formValues.businessNumber.trim() || undefined,
              website: formValues.website.trim() || undefined,
            }
          : undefined,
    };

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
      documents: getProviderSetupDraft()?.documents ?? [],
      isSetupComplete: true,
      isVerified: Boolean(getProviderSetupDraft()?.isVerified),
    };

    try {
      const response = await setupProvider(payload);

      saveProviderSetupDraft({
        ...draft,
        isVerified: response.provider.isVerified,
      });
      setShowSavedState(true);
      setFeedbackMessage(response.message ?? "Provider setup saved successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Provider setup could not be saved.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
                Select whether you operate as an individual or company, then add the
                details that map to the provider profile, detail tables, and verification
                documents.
              </p>
            </div>
            <div
              className="provider-setup__progress"
              aria-label="Provider setup progress"
            >
              <span className="is-active">1. Profile type</span>
              <span className="is-active">2. Provider details</span>
              <span className={showSavedState ? "is-active" : undefined}>
                3. Verification pending
              </span>
            </div>
          </div>

          <form className="provider-setup-form" onSubmit={handleSubmit}>
            <section className="provider-setup-section">
              <div className="provider-setup-section__header">
                <span className="eyebrow">Profile type</span>
                <h2>How do you provide services?</h2>
              </div>

              <div
                className="provider-setup__options"
                role="radiogroup"
                aria-label="Provider type"
              >
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
                      <span className="provider-setup-option__eyebrow">
                        {option.eyebrow}
                      </span>
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
                      onChange={(event) =>
                        updateField("businessName", event.target.value)
                      }
                      placeholder="Registered business name"
                    />
                  </label>
                  <label className="auth-form__field">
                    <span>Business number</span>
                    <input
                      className="auth-form__input"
                      value={formValues.businessNumber}
                      onChange={(event) =>
                        updateField("businessNumber", event.target.value)
                      }
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
                      onChange={(event) =>
                        updateField("professionTitle", event.target.value)
                      }
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
                      onChange={(event) =>
                        updateField("yearsOfExperience", event.target.value)
                      }
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
                  Open the verification documents page from here, submit your documents,
                  and you will return to setup after submission.
                </p>
              </div>

              <div className="provider-setup-section__actions">
                <NavLink
                  className="button button--ghost"
                  state={{ returnTo: routePaths.providerSetup }}
                  to={routePaths.providerVerification}
                >
                  Open verification documents
                </NavLink>
              </div>
            </section>

            {showSavedState ? (
              <div className="provider-setup-verification">
                <span>Setup saved</span>
                <strong>Your provider profile is ready, but not verified yet.</strong>
                <p>
                  Your setup details are saved. Use the verification documents button
                  above when you need to add or update review files.
                </p>
              </div>
            ) : null}

            {feedbackMessage ? (
              <p className="profile-feedback">{feedbackMessage}</p>
            ) : null}
            {errorMessage ? (
              <p className="profile-feedback profile-feedback--error">{errorMessage}</p>
            ) : null}

            <div className="provider-setup__actions">
              <button
                className="button"
                disabled={isSubmitting || isLoadingProfile}
                type="submit"
              >
                {isSubmitting ? "Saving..." : "Save provider setup"}
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
