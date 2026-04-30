import { api } from "@/api/api";

export type ProviderDocument = {
  id: number;
  documentType: string;
  fileUrl: string;
  isVerified: boolean;
  submittedAt: string;
};

export type UploadProviderDocumentPayload = {
  documentType: string;
  file: File;
};

type ProviderDocumentApiResponse =
  | ProviderDocument
  | {
      document: ProviderDocument;
    };

type ProviderDocumentsApiResponse =
  | ProviderDocument[]
  | {
      documents: ProviderDocument[];
    }
  | {
      data: ProviderDocument[];
    };

const PROVIDER_DOCUMENTS_ENDPOINT = "/provider-documents";

const normalizeDocumentResponse = (response: ProviderDocumentApiResponse): ProviderDocument => {
  if ("document" in response) {
    return response.document;
  }

  return response;
};

const normalizeDocumentsResponse = (
  response: ProviderDocumentsApiResponse,
): ProviderDocument[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if ("documents" in response && Array.isArray(response.documents)) {
    return response.documents;
  }

  if ("data" in response && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

export const uploadProviderDocument = async (
  payload: UploadProviderDocumentPayload,
): Promise<ProviderDocument> => {
  const formData = new FormData();
  formData.append("documentType", payload.documentType.trim());
  formData.append("file", payload.file);

  const response = await api.post<ProviderDocumentApiResponse>(PROVIDER_DOCUMENTS_ENDPOINT, {
    body: formData,
    requireAuth: true,
  });

  return normalizeDocumentResponse(response);
};

export const listProviderDocuments = async (): Promise<ProviderDocument[]> => {
  const response = await api.get<ProviderDocumentsApiResponse>(PROVIDER_DOCUMENTS_ENDPOINT, {
    requireAuth: true,
  });

  return normalizeDocumentsResponse(response);
};

export const deleteProviderDocument = (documentId: number): Promise<void> =>
  api.delete<void>(`${PROVIDER_DOCUMENTS_ENDPOINT}/${documentId}`, {
    requireAuth: true,
  });

export const providerDocumentsService = {
  list: listProviderDocuments,
  upload: uploadProviderDocument,
  create: uploadProviderDocument,
  remove: deleteProviderDocument,
  delete: deleteProviderDocument,
};
