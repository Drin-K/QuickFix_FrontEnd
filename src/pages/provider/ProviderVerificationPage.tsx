import { type FormEvent, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { routePaths } from "@/routes/routePaths";
import {
  providerDocumentsService,
  type ProviderDocument,
} from "@/services/provider-documents.service";
import { getProviderVerificationStatus } from "@/services/provider.service";

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

export const ProviderVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ProviderDocument[]>([]);
  const [formValues, setFormValues] = useState<DocumentFormState>(emptyDocumentForm);
  const [successMessage, setSuccessMessage] = useState("");

  const returnTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "returnTo" in location.state &&
    typeof location.state.returnTo === "string"
      ? location.state.returnTo
      : routePaths.providerSetup;
  const verificationStatus = useMemo(() => getProviderVerificationStatus(), [documents]);
  const pendingDocuments = documents.filter((document) => !document.isVerified).length;

  useEffect(() => {
    providerDocumentsService.list().then(setDocuments);
  }, []);

  const updateDocumentType = (value: string) => {
    setFormValues((current) => ({
      ...current,
      documentType: value,
    }));
    setSuccessMessage("");
  };

  const updateFile = (file: File | null) => {
    setFormValues((current) => ({
      ...current,
      file,
    }));
    setSuccessMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.documentType.trim() || !formValues.file) {
      return;
    }

    const document = await providerDocumentsService.create({
      documentType: formValues.documentType,
      file: formValues.file,
    });
    setDocuments((current) => [...current, document]);
    setFormValues(emptyDocumentForm);
    navigate(returnTo, { replace: true });
  };

  const handleRemoveDocument = async (documentId: number) => {
    await providerDocumentsService.remove(documentId);
    setDocuments((current) => current.filter((document) => document.id !== documentId));
    setSuccessMessage("Document removed.");
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
                {verificationStatus.statusLabel}
              </span>
              <strong>
                {verificationStatus.isVerified
                  ? "Your profile is verified."
                  : "Verification is still pending."}
              </strong>
              <p>
                {verificationStatus.isSetupComplete
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
              <strong>{verificationStatus.verifiedDocuments}</strong>
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
                <label className="auth-form__field">
                  <span>Document file</span>
                  <input
                    className="auth-form__input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    type="file"
                    onChange={(event) => updateFile(event.target.files?.[0] ?? null)}
                  />
                </label>
                <button className="button provider-verification-form__submit" type="submit">
                  Add document
                </button>
              </form>

              {successMessage ? (
                <p className="provider-verification__message">{successMessage}</p>
              ) : null}

              <div className="provider-documents-list" aria-live="polite">
                {documents.length ? (
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
                          {document.fileUrl}
                        </a>
                        <p>Submitted {formatDate(document.submittedAt)}</p>
                      </div>
                      <button
                        className="button button--ghost"
                        type="button"
                        onClick={() => handleRemoveDocument(document.id)}
                      >
                        Remove
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
                <h2>{verificationStatus.statusLabel}</h2>
                <p>
                  The status is calculated from provider setup, submitted documents, and the
                  verified flag stored through the provider service.
                </p>
              </div>

              <div className="provider-verification-checklist">
                <span className={verificationStatus.isSetupComplete ? "is-complete" : undefined}>
                  Provider setup completed
                </span>
                <span className={documents.length > 0 ? "is-complete" : undefined}>
                  Documents submitted
                </span>
                <span className={verificationStatus.isVerified ? "is-complete" : undefined}>
                  Admin verification approved
                </span>
              </div>

              <div className="provider-verification-next-step">
                <strong>Next step</strong>
                <p>
                  {verificationStatus.isVerified
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
