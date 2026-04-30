import { api } from "@/api/api";

export type ProviderProfileType = "individual" | "company";

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
  isSetupComplete: boolean;
  isVerified: boolean;
  submittedDocuments: number;
  verifiedDocuments: number;
  statusLabel: "Setup required" | "Documents required" | "Under review" | "Verified";
};

type ProviderVerificationStatusApiResponse =
  | ProviderVerificationStatus
  | {
      verificationStatus: ProviderVerificationStatus;
    }
  | {
      data: ProviderVerificationStatus;
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

  return response;
};

export const getProviderVerificationStatus = async (): Promise<ProviderVerificationStatus> => {
  const response = await api.get<ProviderVerificationStatusApiResponse>(
    "/providers/me/verification-status",
    {
      requireAuth: true,
    },
  );

  return normalizeVerificationStatusResponse(response);
};
