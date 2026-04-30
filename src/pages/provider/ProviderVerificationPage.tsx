import { type FormEvent, useCallback, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import {
  providerDocumentsService,
  type ProviderDocument,
} from "@/services/provider-documents.service";
import {
  getProviderVerificationStatus,
  type ProviderVerificationStatus,
} from "@/services/provider.service";

type DocumentFormState = {
  documentType: string;
  file: File | null;
};

const emptyDocumentForm: DocumentFormState = {
  documentType: "",
  file: null,
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const getFileName = (fileUrl: string): string => {
  try {
    const pathname = fileUrl.startsWith("http")
      ? new URL(fileUrl).pathname
      : fileUrl;
    const fileName = pathname.split("/").filter(Boolean).at(-1);

    return fileName ? decodeURIComponent(fileName) : fileUrl;
  } catch {
    const fileName = fileUrl.split("/").filter(Boolean).at(-1);

    return fileName ?? fileUrl;
  }
};

export const ProviderVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ProviderDocument[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<ProviderVerificationStatus | null>(
    null,
  );
  const [formValues, setFormValues] = useState<DocumentFormState>(emptyDocumentForm);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const returnTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "returnTo" in location.state &&
    typeof location.state.returnTo === "string"
      ? location.state.returnTo
      : routePaths.providerSetup;
  const pendingDocuments = documents.filter((document) => !document.isVerified).length;
  const statusLabel = verificationStatus?.statusLabel ?? "Under review";
  const verifiedDocuments =
    verificationStatus?.verifiedDocuments ??
    documents.filter((document) => document.isVerified).length;
  const isVerified = Boolean(verificationStatus?.isVerified);
  const isSetupComplete = Boolean(verificationStatus?.isSetupComplete);

  const loadVerificationData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [documentsResponse, statusResponse] = await Promise.all([
        providerDocumentsService.list(),
        getProviderVerificationStatus(),
      ]);
      setDocuments(documentsResponse);
      setVerificationStatus(statusResponse);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Verification data could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVerificationData();
  }, [loadVerificationData]);

  const updateDocumentType = (value: string) => {
    setFormValues((current) => ({
      ...current,
      documentType: value,
    }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const updateFile = (file: File | null) => {
    setFormValues((current) => ({
      ...current,
      file,
    }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.documentType.trim() || !formValues.file) {
      setErrorMessage("Choose a document type and file before uploading.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const document = await providerDocumentsService.create({
        documentType: formValues.documentType,
        file: formValues.file,
      });
      setDocuments((current) => [...current, document]);
      setFormValues(emptyDocumentForm);
      setFileInputKey((current) => current + 1);
      setSuccessMessage("Document uploaded for verification review.");
      await loadVerificationData();
      window.setTimeout(() => navigate(returnTo, { replace: true }), 900);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Document upload failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDocument = async (documentId: number) => {
    setDeletingDocumentId(documentId);
    setErrorMessage("");

    try {
      await providerDocumentsService.remove(documentId);
      setDocuments((current) => current.filter((document) => document.id !== documentId));
      setSuccessMessage("Document removed.");
      await loadVerificationData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Document could not be deleted.",
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  return (
    <ProviderLayout>
      <section className="section provider-verification">
        <div className="container">
          <div className="provider-verification__hero">
            <div>
              <span className="eyebrow">Provider verification</span>
              <h1>Manage documents and verification readiness.</h1>
              <p>
                Keep identity, license, or business files organized so the provider profile
                can move through review with a clear status.
              </p>
            </div>

            <aside className="provider-verification-status">
              <span className="provider-verification-status__label">
                {statusLabel}
              </span>
              <strong>
                {isVerified ? "Your profile is verified." : "Verification is still pending."}
              </strong>
              <p>
                {isSetupComplete
                  ? "Provider setup is complete. Documents determine the next verification step."
                  : "Complete provider setup before final verification can be reviewed."}
              </p>
            </aside>
          </div>

          <div className="provider-verification__summary">
            <article>
              <strong>{documents.length}</strong>
              <span>Documents submitted</span>
            </article>
            <article>
              <strong>{verifiedDocuments}</strong>
              <span>Documents verified</span>
            </article>
            <article>
              <strong>{pendingDocuments}</strong>
              <span>Documents pending</span>
            </article>
          </div>

          <div className="provider-verification__grid">
            <section className="provider-verification-panel">
              <div className="provider-verification-panel__header">
                <span className="eyebrow">Documents</span>
                <h2>Verification documents</h2>
                <p>Add files that prove your provider identity, certification, or company status.</p>
              </div>

              <form className="provider-verification-form" onSubmit={handleSubmit}>
                <label className="auth-form__field">
                  <span>Document type</span>
                  <input
                    className="auth-form__input"
                    placeholder="license, national_id, business_registration"
                    required
                    value={formValues.documentType}
                    onChange={(event) => updateDocumentType(event.target.value)}
                  />
                </label>
                <label className="auth-form__field provider-verification-file-field">
                  <span>Document file</span>
                  <input
                    key={fileInputKey}
                    className="auth-form__input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    type="file"
                    onChange={(event) => updateFile(event.target.files?.[0] ?? null)}
                  />
                  <span className="provider-verification-file">
                    <span className="provider-verification-file__button">Choose file</span>
                    <span className="provider-verification-file__name">
                      {formValues.file?.name ?? "No file selected"}
                    </span>
                  </span>
                </label>
                <button
                  className="button provider-verification-form__submit"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Uploading..." : "Add document"}
                </button>
              </form>

              {successMessage ? (
                <p className="provider-verification__message">{successMessage}</p>
              ) : null}
              {errorMessage ? (
                <p className="provider-verification__message provider-verification__message--error">
                  {errorMessage}
                </p>
              ) : null}

              <div className="provider-documents-list" aria-live="polite">
                {isLoading ? (
                  <div className="provider-documents-empty">
                    <strong>Loading documents...</strong>
                    <p>Verification data is being loaded from the backend.</p>
                  </div>
                ) : documents.length ? (
                  documents.map((document) => (
                    <article className="provider-document-card" key={document.id}>
                      <div>
                        <span
                          className={
                            document.isVerified
                              ? "provider-document-card__status provider-document-card__status--verified"
                              : "provider-document-card__status provider-document-card__status--pending"
                          }
                        >
                          {document.isVerified ? "Verified" : "Pending review"}
                        </span>
                        <h3>{document.documentType}</h3>
                        <a href={document.fileUrl} target="_blank" rel="noreferrer">
                          {getFileName(document.fileUrl)}
                        </a>
                        <p>Submitted {formatDate(document.submittedAt)}</p>
                      </div>
                      <button
                        className="button button--ghost"
                        disabled={deletingDocumentId === document.id}
                        type="button"
                        onClick={() => handleRemoveDocument(document.id)}
                      >
                        {deletingDocumentId === document.id ? "Removing..." : "Remove"}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className="provider-documents-empty">
                    <strong>No documents added yet.</strong>
                    <p>Add at least one document to move verification into review.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="provider-verification-panel provider-verification-panel--status">
              <div className="provider-verification-panel__header">
                <span className="eyebrow">Verification status</span>
                <h2>{statusLabel}</h2>
                <p>
                  The status is calculated from provider setup, submitted documents, and the
                  verified flag stored through the provider service.
                </p>
              </div>

              <div className="provider-verification-checklist">
                <span className={isSetupComplete ? "is-complete" : undefined}>
                  Provider setup completed
                </span>
                <span className={documents.length > 0 ? "is-complete" : undefined}>
                  Documents submitted
                </span>
                <span className={isVerified ? "is-complete" : undefined}>
                  Admin verification approved
                </span>
              </div>

              <div className="provider-verification-next-step">
                <strong>Next step</strong>
                <p>
                  {isVerified
                    ? "Keep documents current when licenses or company records change."
                    : documents.length > 0
                      ? "Wait for review or update documents if a newer file is available."
                      : "Upload the first verification document to start the review state."}
                </p>
                <NavLink className="workspace-card-link" to={returnTo}>
                  Back to provider setup
                </NavLink>
              </div>
            </section>
          </div>
        </div>
      </section>
    </ProviderLayout>
  );
};
