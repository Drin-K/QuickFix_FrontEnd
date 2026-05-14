import { useEffect, useState } from "react";
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

export const AdminProviderDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [providerDetails, setProviderDetails] = useState<AdminProviderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const providerId = Number(id);
  const hasValidProviderId = Number.isInteger(providerId) && providerId > 0;

  useEffect(() => {
    if (!hasValidProviderId) {
      setErrorMessage("The requested provider id is invalid.");
      setIsLoading(false);
      return;
    }

    const loadProviderDetails = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await adminService.getProviderDetails(providerId);
        setProviderDetails(response);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearAuthSession();
          navigate(routePaths.login);
          return;
        }

        if (error instanceof ApiError && error.status === 403) {
          setErrorMessage("Only admins can view provider details.");
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setErrorMessage("Provider not found.");
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Provider details could not be loaded.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProviderDetails();
  }, [hasValidProviderId, navigate, providerId]);

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
                </div>
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
