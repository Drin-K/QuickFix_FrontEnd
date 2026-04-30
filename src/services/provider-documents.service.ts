import {
  getProviderSetupDraft,
  saveProviderSetupDraft,
  type ProviderDocumentDraft,
  type ProviderSetupDraft,
} from "@/services/provider.service";

export type ProviderDocument = ProviderDocumentDraft & {
  id: number;
  submittedAt: string;
};

export type CreateProviderDocumentPayload = {
  documentType: string;
  fileUrl: string;
};

const PROVIDER_DOCUMENTS_KEY = "providerVerificationDocuments";

const normalizeDocument = (
  document: ProviderDocumentDraft | ProviderDocument,
  index: number,
): ProviderDocument => ({
  id: "id" in document && typeof document.id === "number" ? document.id : index + 1,
  documentType: document.documentType,
  fileUrl: document.fileUrl,
  isVerified: document.isVerified,
  submittedAt:
    "submittedAt" in document && typeof document.submittedAt === "string"
      ? document.submittedAt
      : new Date().toISOString(),
});

const readStoredDocuments = (): ProviderDocument[] => {
  const rawDocuments = localStorage.getItem(PROVIDER_DOCUMENTS_KEY);

  if (!rawDocuments) {
    const draftDocuments = getProviderSetupDraft()?.documents ?? [];
    return draftDocuments.map(normalizeDocument);
  }

  try {
    const parsedDocuments = JSON.parse(rawDocuments) as ProviderDocument[];

    if (!Array.isArray(parsedDocuments)) {
      return [];
    }

    return parsedDocuments
      .filter(
        (document) =>
          document &&
          typeof document.documentType === "string" &&
          typeof document.fileUrl === "string" &&
          typeof document.isVerified === "boolean",
      )
      .map(normalizeDocument);
  } catch {
    localStorage.removeItem(PROVIDER_DOCUMENTS_KEY);
    return [];
  }
};

const mergeWithSetupDraft = (documents: ProviderDocument[]) => {
  const draft = getProviderSetupDraft();

  if (!draft) {
    return;
  }

  const updatedDraft: ProviderSetupDraft = {
    ...draft,
    documents: documents.map(({ documentType, fileUrl, isVerified }) => ({
      documentType,
      fileUrl,
      isVerified,
    })),
    isVerified: documents.length > 0 && documents.every((document) => document.isVerified),
  };

  saveProviderSetupDraft(updatedDraft);
};

const writeDocuments = (documents: ProviderDocument[]) => {
  localStorage.setItem(PROVIDER_DOCUMENTS_KEY, JSON.stringify(documents));
  mergeWithSetupDraft(documents);
};

export const providerDocumentsService = {
  async list(): Promise<ProviderDocument[]> {
    return readStoredDocuments();
  },

  async create(payload: CreateProviderDocumentPayload): Promise<ProviderDocument> {
    const documents = readStoredDocuments();
    const nextId = documents.reduce((maxId, document) => Math.max(maxId, document.id), 0) + 1;
    const document: ProviderDocument = {
      id: nextId,
      documentType: payload.documentType.trim(),
      fileUrl: payload.fileUrl.trim(),
      isVerified: false,
      submittedAt: new Date().toISOString(),
    };

    writeDocuments([...documents, document]);
    return document;
  },

  async remove(documentId: number): Promise<void> {
    const documents = readStoredDocuments().filter((document) => document.id !== documentId);
    writeDocuments(documents);
  },
};
