import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/api/api";
import { AdminLayout } from "@/layouts/AdminLayout";
import { routePaths } from "@/routes/routePaths";
import { adminService, type AdminProviderDetails } from "@/services/admin.service";
import { clearAuthSession } from "@/utils/auth";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

const formatDate = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatMaybeNumber = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Not available";
  }

  return String(value);
};

const formatPrice = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return currencyFormatter.format(amount);
};

const formatProviderType = (type?: AdminProviderDetails["provider"]["type"]) => {
  if (type === "company") {
    return "Company";
  }

  if (type === "individual") {
    return "Individual";
  }

  return "Not available";
};

const formatServiceStatus = (isActive: boolean) => (isActive ? "Active" : "Inactive");

const formatVerificationStatus = (verification: AdminProviderDetails["verification"]) => {
  if (verification.isVerified) {
    return "Verified";
  }

  if (!verification.isSetupComplete) {
    return "Setup required";
  }

  if (verification.status === "pending") {
    return "Under review";
  }

  return "Unverified";
};

const formatDocumentStatus = (document: AdminProviderDetails["documents"][number]) =>
  document.isVerified ? "Verified" : "Pending review";

const providerVerificationActionKey = (action: "verify" | "unverify") =>
  `provider-${action}`;

const documentVerificationActionKey = (
  documentId: string | number,
  action: "verify" | "unverify",
) => `document-${String(documentId)}-${action}`;

export const AdminProviderDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [providerDetails, setProviderDetails] = useState<AdminProviderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const loadedProviderIdRef = useRef<number | null>(null);

  const providerId = Number(id);
  const hasValidProviderId = Number.isInteger(providerId) && providerId > 0;

  useEffect(() => {
    if (!hasValidProviderId) {
      loadedProviderIdRef.current = null;
      setProviderDetails(null);
      setErrorMessage("The requested provider id is invalid.");
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    let isActive = true;

    const loadProviderDetails = async () => {
      const isInitialLoad = loadedProviderIdRef.current !== providerId;

      if (isInitialLoad) {
        setProviderDetails(null);
        setActionMessage(null);
        setActionError(null);
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setErrorMessage(null);

      try {
        const response = await adminService.getProviderDetails(providerId);
        if (!isActive) {
          return;
        }

        setProviderDetails(response);
        loadedProviderIdRef.current = providerId;
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          clearAuthSession();
          navigate(routePaths.login);
          return;
        }

        if (error instanceof ApiError && error.status === 403) {
          if (isInitialLoad) {
            setErrorMessage("Only admins can view provider details.");
            setProviderDetails(null);
          } else {
            setActionError("Only admins can update provider verification.");
          }
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          if (isInitialLoad) {
            setErrorMessage("Provider not found.");
            setProviderDetails(null);
          } else {
            setActionError("The provider details could not be refreshed.");
          }
          return;
        }

        const message =
          error instanceof Error ? error.message : "Provider details could not be loaded.";

        if (isInitialLoad) {
          setErrorMessage(message);
          setProviderDetails(null);
        } else {
          setActionError(message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    void loadProviderDetails();
    return () => {
      isActive = false;
    };
  }, [hasValidProviderId, navigate, providerId, refreshKey]);

  const performVerificationAction = async ({
    actionKey,
    confirmationMessage,
    successFallbackMessage,
    failureFallbackMessage,
    forbiddenMessage,
    notFoundMessage,
    action,
  }: {
    actionKey: string;
    confirmationMessage: string;
    successFallbackMessage: string;
    failureFallbackMessage: string;
    forbiddenMessage: string;
    notFoundMessage: string;
    action: () => Promise<{ message: string }>;
  }) => {
    if (!window.confirm(confirmationMessage)) {
      return;
    }

    setPendingAction(actionKey);
    setActionMessage(null);
    setActionError(null);

    try {
      const response = await action();
      setActionMessage(response.message || successFallbackMessage);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError && error.status === 403) {
        setActionError(forbiddenMessage);
        return;
      }

      if (error instanceof ApiError && error.status === 404) {
        setActionError(notFoundMessage);
        return;
      }

      setActionError(error instanceof Error ? error.message : failureFallbackMessage);
    } finally {
      setPendingAction(null);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <section className="section admin-providers">
          <div className="container">
            <div className="admin-providers-state">
              <strong>Loading provider details.</strong>
              <p>Fetching the profile, documents, and services summary from the backend.</p>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (!providerDetails) {
    return (
      <AdminLayout>
        <section className="section admin-providers">
          <div className="container">
            <div className="admin-providers-state admin-providers-state--error">
              <strong>Provider details could not be loaded.</strong>
              <p>{errorMessage ?? "The provider record is unavailable right now."}</p>
              <div>
                <Link className="button" to={routePaths.adminProviders}>
                  Back to providers
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  const { provider, companyDetails, individualDetails, documents, servicesSummary, verification } =
    providerDetails;
  const providerActionKey = providerVerificationActionKey(
    verification.isVerified ? "unverify" : "verify",
  );
  const providerActionLabel = verification.isVerified
    ? pendingAction === providerVerificationActionKey("unverify")
      ? "Unverifying provider..."
      : "Unverify provider"
    : pendingAction === providerVerificationActionKey("verify")
      ? "Verifying provider..."
      : "Verify provider";
  const detailItems =
    provider.type === "company"
      ? [
          ["Business name", companyDetails?.businessName ?? "Not available"],
          ["Business number", companyDetails?.businessNumber ?? "Not available"],
          ["Website", companyDetails?.website ?? "Not available"],
          ["Registration number", companyDetails?.registrationNumber ?? "Not available"],
          ["Tax number", companyDetails?.taxNumber ?? "Not available"],
          ["VAT number", companyDetails?.vatNumber ?? "Not available"],
          ["Country", companyDetails?.country ?? "Not available"],
          ["City", companyDetails?.city ?? "Not available"],
          ["Address", companyDetails?.address ?? "Not available"],
        ]
      : [
          ["Profession", individualDetails?.professionTitle ?? "Not available"],
          ["Years of experience", formatMaybeNumber(individualDetails?.yearsOfExperience)],
          ["Bio", individualDetails?.bio ?? "Not available"],
          [
            "Skills",
            individualDetails?.skills?.length ? individualDetails.skills.join(", ") : "Not available",
          ],
          [
            "Certifications",
            individualDetails?.certifications?.length
              ? individualDetails.certifications.join(", ")
              : "Not available",
          ],
        ];

  const verificationLabel = formatVerificationStatus(verification);
  const documentSummary = `${verification.submittedDocuments} document(s)`;
  const serviceSummary = `${servicesSummary.totalServices} service(s)`;
  const hasActionFeedback = Boolean(actionMessage || actionError || isRefreshing);
  const isActionPending = pendingAction !== null || isRefreshing;

  return (
    <AdminLayout>
      <section className="section admin-providers">
        <div className="container">
          <Link className="button button--ghost" to={routePaths.adminProviders}>
            Back to providers
          </Link>

          <div className="admin-providers__header" style={{ marginTop: "1rem" }}>
            <div>
              <span className="eyebrow">Provider details</span>
              <h1>{provider.displayName}</h1>
              <p>
                Full admin view for the provider profile, verification documents, and
                recent services.
              </p>
            </div>

            <aside className="admin-providers__summary">
              <span>{verificationLabel}</span>
              <strong>{formatProviderType(provider.type)}</strong>
              <p>
                {provider.servicesCount ?? 0} services · {provider.documentsCount ?? 0} documents
              </p>
            </aside>
          </div>

          {hasActionFeedback ? (
            <div className="admin-provider-details__feedback" aria-live="polite">
              {isRefreshing ? (
                <div className="admin-provider-details__feedback-item admin-provider-details__feedback-item--info">
                  Refreshing provider details after the latest verification change.
                </div>
              ) : null}

              {actionMessage ? (
                <div className="admin-provider-details__feedback-item admin-provider-details__feedback-item--success">
                  {actionMessage}
                </div>
              ) : null}

              {actionError ? (
                <div className="admin-provider-details__feedback-item admin-provider-details__feedback-item--error">
                  {actionError}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="service-details__content" style={{ marginTop: "1rem" }}>
            <div className="service-details__panel">
              <h2>Profile overview</h2>
              <p>
                Review the core profile fields that power provider discovery and admin
                moderation.
              </p>
              <div className="service-details__meta-list">
                <div>
                  <strong>Provider ID</strong>
                  <span>#{provider.id}</span>
                </div>
                <div>
                  <strong>Tenant ID</strong>
                  <span>#{provider.tenantId ?? "Not available"}</span>
                </div>
                <div>
                  <strong>Type</strong>
                  <span>{formatProviderType(provider.type)}</span>
                </div>
                <div>
                  <strong>Owner</strong>
                  <span>{provider.ownerName ?? "Not available"}</span>
                </div>
                <div>
                  <strong>Email</strong>
                  <span>{provider.ownerEmail ?? "Not available"}</span>
                </div>
                <div>
                  <strong>City</strong>
                  <span>{provider.city ?? "Not available"}</span>
                </div>
                <div>
                  <strong>Address</strong>
                  <span>{provider.address ?? "Not available"}</span>
                </div>
                <div>
                  <strong>Created</strong>
                  <span>{formatDate(provider.createdAt)}</span>
                </div>
                <div>
                  <strong>Updated</strong>
                  <span>{formatDate(provider.updatedAt)}</span>
                </div>
              </div>
            </div>

            <aside className="service-details__sidebar">
              <div className="service-details__meta-card">
                <h2>Verification</h2>
                <strong>{verification.statusLabel}</strong>
                <p>
                  {verification.isVerified
                    ? "The provider is fully verified."
                    : "Verification is still in progress or needs setup completion."}
                </p>
                <div className="service-details__meta-list">
                  <div>
                    <strong>Status</strong>
                    <span>{verificationLabel}</span>
                  </div>
                  <div>
                    <strong>Documents</strong>
                    <span>{documentSummary}</span>
                  </div>
                  <div>
                    <strong>Verified documents</strong>
                    <span>{verification.verifiedDocuments}</span>
                  </div>
                  <div>
                    <strong>Pending documents</strong>
                    <span>{verification.pendingDocuments}</span>
                  </div>
                  <div>
                    <strong>Setup complete</strong>
                    <span>{verification.isSetupComplete ? "Yes" : "No"}</span>
                  </div>
                  {verification.reviewedBy ? (
                    <div>
                      <strong>Reviewed by</strong>
                      <span>{verification.reviewedBy}</span>
                    </div>
                  ) : null}
                  {verification.reviewedAt ? (
                    <div>
                      <strong>Reviewed at</strong>
                      <span>{formatDate(verification.reviewedAt)}</span>
                    </div>
                  ) : null}
                  {verification.notes ? (
                    <div>
                      <strong>Notes</strong>
                      <span>{verification.notes}</span>
                    </div>
                  ) : null}
                </div>

                <div className="admin-provider-details__actions">
                  <button
                    className={verification.isVerified ? "button button--light" : "button"}
                    disabled={isActionPending}
                    type="button"
                    onClick={() => {
                      void performVerificationAction({
                        actionKey: providerActionKey,
                        confirmationMessage: verification.isVerified
                          ? "Remove verification from this provider?"
                          : "Verify this provider?",
                        successFallbackMessage: verification.isVerified
                          ? "Provider unverified successfully."
                          : "Provider verified successfully.",
                        failureFallbackMessage: verification.isVerified
                          ? "The provider could not be unverified."
                          : "The provider could not be verified.",
                        forbiddenMessage: "Only admins can update provider verification.",
                        notFoundMessage: "Provider not found.",
                        action: () =>
                          verification.isVerified
                            ? adminService.unverifyProvider(provider.id)
                            : adminService.verifyProvider(provider.id),
                      });
                    }}
                  >
                    {providerActionLabel}
                  </button>
                </div>

                <p className="admin-provider-details__helper">
                  Only admins can update provider verification.
                </p>
              </div>

              <div className="service-details__meta-card">
                <h2>Quick facts</h2>
                <div className="service-details__meta-list">
                  <div>
                    <strong>Services</strong>
                    <span>{serviceSummary}</span>
                  </div>
                  <div>
                    <strong>Active services</strong>
                    <span>{servicesSummary.activeServices}</span>
                  </div>
                  <div>
                    <strong>Inactive services</strong>
                    <span>{servicesSummary.inactiveServices}</span>
                  </div>
                  <div>
                    <strong>Average price</strong>
                    <span>{formatPrice(servicesSummary.averagePrice)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="admin-providers-panel">
            <div className="admin-providers-panel__header">
              <h2>{provider.type === "company" ? "Company details" : "Individual details"}</h2>
              <span>{provider.type === "company" ? "Business profile" : "Personal profile"}</span>
            </div>

            <div className="service-details__panel" style={{ margin: "1rem" }}>
              {provider.type === "company" ? (
                companyDetails ? (
                  <div className="service-details__meta-list">
                    {detailItems.map(([label, value]) => (
                      <div key={label}>
                        <strong>{label}</strong>
                        <span>
                          {label === "Website" && value !== "Not available" ? (
                            <a href={String(value)} rel="noreferrer" target="_blank">
                              {String(value)}
                            </a>
                          ) : (
                            value
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No company details were submitted for this provider.</p>
                )
              ) : individualDetails ? (
                <div className="service-details__meta-list">
                  {detailItems.map(([label, value]) => (
                    <div key={label}>
                      <strong>{label}</strong>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No individual details were submitted for this provider.</p>
              )}
            </div>
          </section>

          <section className="admin-providers-panel">
            <div className="admin-providers-panel__header">
              <h2>Documents</h2>
              <span>
                {documents.length} total · {verification.verifiedDocuments} verified ·{" "}
                {verification.pendingDocuments} pending
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="admin-providers-state">
                <strong>No documents found.</strong>
                <p>The provider has not uploaded verification documents yet.</p>
              </div>
            ) : (
              <div className="admin-providers-table-wrap">
                <table className="admin-providers-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>File</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document) => (
                      <tr key={document.id}>
                        <td>
                          <strong>{document.documentType}</strong>
                          <span>#{document.id}</span>
                        </td>
                        <td>
                          <span
                            className={
                              document.isVerified
                                ? "admin-provider-status admin-provider-status--verified"
                                : "admin-provider-status admin-provider-status--unverified"
                            }
                          >
                            {formatDocumentStatus(document)}
                          </span>
                        </td>
                        <td>{formatDate(document.submittedAt)}</td>
                        <td>
                          <a className="button button--ghost" href={document.fileUrl} target="_blank" rel="noreferrer">
                            Open file
                          </a>
                        </td>
                        <td>
                          <div className="admin-provider-documents__actions">
                            <button
                              className={
                                document.isVerified ? "button button--light" : "button"
                              }
                              disabled={isActionPending}
                              type="button"
                              onClick={() => {
                                void performVerificationAction({
                                  actionKey: documentVerificationActionKey(
                                    document.id,
                                    document.isVerified ? "unverify" : "verify",
                                  ),
                                  confirmationMessage: document.isVerified
                                    ? `Remove verification from ${document.documentType}?`
                                    : `Verify ${document.documentType}?`,
                                  successFallbackMessage: document.isVerified
                                    ? "Document unverified successfully."
                                    : "Document verified successfully.",
                                  failureFallbackMessage: document.isVerified
                                    ? "The document could not be unverified."
                                    : "The document could not be verified.",
                                  forbiddenMessage:
                                    "Only admins can update document verification.",
                                  notFoundMessage: "Document not found.",
                                  action: () =>
                                    document.isVerified
                                      ? adminService.unverifyProviderDocument(document.id)
                                      : adminService.verifyProviderDocument(document.id),
                                });
                              }}
                            >
                              {document.isVerified
                                ? pendingAction ===
                                  documentVerificationActionKey(document.id, "unverify")
                                  ? "Unverifying..."
                                  : "Unverify document"
                                : pendingAction ===
                                    documentVerificationActionKey(document.id, "verify")
                                  ? "Verifying..."
                                  : "Verify document"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="admin-providers-panel">
            <div className="admin-providers-panel__header">
              <h2>Services</h2>
              <span>
                {servicesSummary.totalServices} total · {servicesSummary.activeServices} active ·{" "}
                {servicesSummary.inactiveServices} inactive
              </span>
            </div>

            {servicesSummary.services.length === 0 ? (
              <div className="admin-providers-state">
                <strong>No services found.</strong>
                <p>The provider has no services to summarize yet.</p>
              </div>
            ) : (
              <div className="admin-providers-table-wrap">
                <table className="admin-providers-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesSummary.services.map((service) => (
                      <tr key={service.id}>
                        <td>
                          <strong>{service.title}</strong>
                          <span>#{service.id}</span>
                        </td>
                        <td>{service.category?.name ?? "Uncategorized"}</td>
                        <td>
                          <span
                            className={
                              service.isActive
                                ? "admin-provider-status admin-provider-status--verified"
                                : "admin-provider-status admin-provider-status--unverified"
                            }
                          >
                            {formatServiceStatus(service.isActive)}
                          </span>
                        </td>
                        <td>{formatPrice(service.basePrice)}</td>
                        <td>{formatDate(service.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    </AdminLayout>
  );
};
