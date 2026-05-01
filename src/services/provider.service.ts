import { api } from "@/api/api";

export type ProviderProfileType = "individual" | "company";

export type ProviderIndividualDetailsPayload = {
  professionTitle: string;
  yearsOfExperience?: number;
  bio?: string;
};

export type ProviderCompanyDetailsPayload = {
  businessName: string;
  businessNumber?: string;
  website?: string;
};

export type ProviderSetupPayload = {
  type: ProviderProfileType;
  displayName: string;
  description?: string;
  cityId?: number;
  address?: string;
  individualDetails?: ProviderIndividualDetailsPayload;
  companyDetails?: ProviderCompanyDetailsPayload;
};

export type ProviderProfileResponse = {
  provider: {
    id: number;
    tenantId: number;
    ownerUserId?: number;
    type: ProviderProfileType;
    displayName: string;
    description: string | null;
    cityId: number | null;
    address: string | null;
    isVerified: boolean;
    averageRating: string | number | null;
    createdAt?: string;
    updatedAt?: string;
  };
  individualDetails: {
    id: number;
    tenantId: number;
    providerId: number;
    professionTitle: string;
    yearsOfExperience: number | null;
    bio: string | null;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  companyDetails: {
    id: number;
    tenantId: number;
    providerId: number;
    businessName: string;
    businessNumber: string | null;
    website: string | null;
    createdAt?: string;
    updatedAt?: string;
  } | null;
};

export type ProviderSetupResponse = ProviderProfileResponse & {
  message?: string;
};

export type ProviderDocumentDraft = {
  documentType: string;
  fileUrl: string;
  isVerified: boolean;
};

export type ProviderIndividualDetailsDraft = {
  professionTitle: string;
  yearsOfExperience: string;
  bio: string;
};

export type ProviderCompanyDetailsDraft = {
  businessName: string;
  businessNumber: string;
  website: string;
};

export type ProviderSetupDraft = {
  type: ProviderProfileType;
  displayName: string;
  description: string;
  cityId: string;
  address: string;
  individualDetails?: ProviderIndividualDetailsDraft;
  companyDetails?: ProviderCompanyDetailsDraft;
  documents: ProviderDocumentDraft[];
  isSetupComplete: boolean;
  isVerified: boolean;
};

export type ProviderVerificationStatus = {
  providerId?: number;
  tenantId?: number;
  isSetupComplete?: boolean;
  isVerified: boolean;
  submittedDocuments?: number;
  verifiedDocuments?: number;
  status?: "verified" | "pending";
  statusLabel: "Setup required" | "Documents required" | "Under review" | "Verified";
};

type ProviderVerificationStatusApiResponse =
  | ProviderVerificationStatus
  | {
      verificationStatus: ProviderVerificationStatus;
    }
  | {
      data: ProviderVerificationStatus;
    }
  | {
      providerId: number;
      tenantId: number;
      isVerified: boolean;
      status: "verified" | "pending";
    };

const PROVIDER_SETUP_DRAFT_KEY = "providerSetupDraft";

export const getProviderSetupDraft = (): ProviderSetupDraft | null => {
  const storedDraft = localStorage.getItem(PROVIDER_SETUP_DRAFT_KEY);

  if (!storedDraft) {
    return null;
  }

  try {
    return JSON.parse(storedDraft) as ProviderSetupDraft;
  } catch {
    localStorage.removeItem(PROVIDER_SETUP_DRAFT_KEY);
    return null;
  }
};

export const saveProviderSetupDraft = (draft: ProviderSetupDraft) => {
  localStorage.setItem(PROVIDER_SETUP_DRAFT_KEY, JSON.stringify(draft));
};

export const hasCompletedProviderSetup = (): boolean => {
  return Boolean(getProviderSetupDraft()?.isSetupComplete);
};

export const getLocalProviderVerificationStatus = (): ProviderVerificationStatus => {
  const draft = getProviderSetupDraft();
  const documents = draft?.documents ?? [];
  const submittedDocuments = documents.length;
  const verifiedDocuments = documents.filter((document) => document.isVerified).length;
  const isSetupComplete = Boolean(draft?.isSetupComplete);
  const isVerified = Boolean(draft?.isVerified);

  let statusLabel: ProviderVerificationStatus["statusLabel"] = "Setup required";

  if (isVerified) {
    statusLabel = "Verified";
  } else if (!isSetupComplete) {
    statusLabel = "Setup required";
  } else if (submittedDocuments === 0) {
    statusLabel = "Documents required";
  } else {
    statusLabel = "Under review";
  }

  return {
    isSetupComplete,
    isVerified,
    submittedDocuments,
    verifiedDocuments,
    statusLabel,
  };
};

const normalizeVerificationStatusResponse = (
  response: ProviderVerificationStatusApiResponse,
): ProviderVerificationStatus => {
  if ("verificationStatus" in response) {
    return response.verificationStatus;
  }

  if ("data" in response) {
    return response.data;
  }

  if ("status" in response && !("statusLabel" in response)) {
    return {
      providerId: response.providerId,
      tenantId: response.tenantId,
      isSetupComplete: true,
      isVerified: response.isVerified,
      status: response.status,
      statusLabel: response.isVerified ? "Verified" : "Under review",
    };
  }

  return response as ProviderVerificationStatus;
};

export const getProviderVerificationStatus =
  async (): Promise<ProviderVerificationStatus> => {
    const response = await api.get<ProviderVerificationStatusApiResponse>(
      "/providers/me/verification-status",
      {
        requireAuth: true,
      },
    );

    return normalizeVerificationStatusResponse(response);
  };

export const setupProvider = (payload: ProviderSetupPayload) => {
  return api.post<ProviderSetupResponse>("/providers/setup", {
    body: payload,
    requireAuth: true,
  });
};

export const getProviderProfile = () => {
  return api.get<ProviderProfileResponse>("/providers/me", {
    requireAuth: true,
  });
};

export const updateProviderProfile = (payload: Partial<ProviderSetupPayload>) => {
  return api.put<ProviderProfileResponse>("/providers/me", {
    body: payload,
    requireAuth: true,
  });
};
