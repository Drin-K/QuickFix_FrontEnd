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
