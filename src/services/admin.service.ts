import { api } from "@/api/api";

export type AdminRecentActivity = {
  id: string | number;
  title: string;
  description?: string;
  occurredAt?: string;
  type?: string;
  status?: string;
  actor?: string;
};

export type AdminDashboardStats = {
  totalProviders: number;
  pendingProviders: number;
  verifiedProviders: number;
  pendingDocuments: number;
  activeServices: number;
  clientsCount: number;
  recentActivity: AdminRecentActivity[];
};

export type AdminProviderType = "individual" | "company";

export type AdminProviderVerificationStatus = "verified" | "unverified" | "pending";

export type AdminProvidersQuery = {
  search?: string;
  verificationStatus?: "verified" | "unverified";
  type?: AdminProviderType;
};

export type AdminProvider = {
  id: string | number;
  displayName: string;
  type: AdminProviderType | null;
  verificationStatus: AdminProviderVerificationStatus;
  isVerified: boolean;
  ownerName?: string;
  ownerEmail?: string;
  city?: string;
  address?: string;
  servicesCount?: number;
  documentsCount?: number;
  createdAt?: string;
};

export type AdminProvidersResponse = {
  providers: AdminProvider[];
  total: number;
};

export type AdminServiceStatus = "active" | "inactive";

export type AdminServicesQuery = {
  search?: string;
  providerId?: number;
  categoryId?: number;
  status?: AdminServiceStatus;
};

export type AdminService = {
  id: string | number;
  title: string;
  description?: string;
  basePrice: string;
  isActive: boolean;
  status: AdminServiceStatus;
  provider?: {
    id: string | number;
    displayName: string;
    isVerified?: boolean;
  } | null;
  category?: {
    id: string | number;
    name: string;
  } | null;
  coverImageUrl?: string;
  createdAt?: string;
};

export type AdminServicesResponse = {
  services: AdminService[];
  total: number;
};

export type AdminProviderDetailsProvider = AdminProvider & {
  description?: string;
  phone?: string;
  tenantId?: string;
  updatedAt?: string;
  verifiedAt?: string;
  verificationNotes?: string;
};

export type AdminProviderCompanyDetails = {
  id?: string | number;
  businessName?: string;
  businessNumber?: string;
  website?: string;
  registrationNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProviderIndividualDetails = {
  id?: string | number;
  professionTitle?: string;
  yearsOfExperience?: number;
  bio?: string;
  skills?: string[];
  certifications?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProviderDocument = {
  id: string | number;
  documentType: string;
  fileUrl: string;
  isVerified: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
};

export type AdminProviderServiceSummaryItem = {
  id: string | number;
  title: string;
  category?: {
    id: string | number;
    name: string;
  } | null;
  basePrice?: string;
  isActive: boolean;
  status: AdminServiceStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminProviderServicesSummary = {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  services: AdminProviderServiceSummaryItem[];
  averagePrice?: string;
};

export type AdminProviderVerificationDetails = {
  isSetupComplete: boolean;
  isVerified: boolean;
  status: AdminProviderVerificationStatus;
  statusLabel: string;
  totalDocuments: number;
  submittedDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  updatedAt?: string;
};

export type AdminProviderDetails = {
  provider: AdminProviderDetailsProvider;
  companyDetails: AdminProviderCompanyDetails | null;
  individualDetails: AdminProviderIndividualDetails | null;
  documents: AdminProviderDocument[];
  servicesSummary: AdminProviderServicesSummary;
  verification: AdminProviderVerificationDetails;
};

export type AdminServiceActionResponse = {
  message: string;
  service: AdminService;
};

type AdminDashboardStatsApiResponse =
  | AdminDashboardStats
  | {
      stats: AdminDashboardStats;
    }
  | {
      dashboardStats: AdminDashboardStats;
    }
  | {
      data: AdminDashboardStats | { stats: AdminDashboardStats };
    };

type AdminProvidersApiResponse =
  | unknown[]
  | {
      providers?: unknown[];
      data?: unknown[] | { providers?: unknown[]; items?: unknown[]; total?: unknown };
      items?: unknown[];
      total?: unknown;
      count?: unknown;
    };

type AdminServicesApiResponse =
  | unknown[]
  | {
      services?: unknown[];
      data?: unknown[] | { services?: unknown[]; items?: unknown[]; total?: unknown };
      items?: unknown[];
      total?: unknown;
      count?: unknown;
    };

type AdminServiceActionApiResponse =
  | unknown
  | {
      message?: unknown;
      service?: unknown;
      data?: unknown | { message?: unknown; service?: unknown };
    };

type AdminProviderDetailsApiResponse =
  | unknown
  | {
      provider?: unknown;
      details?: unknown;
      documents?: unknown[];
      servicesSummary?: unknown;
      verificationInfo?: unknown;
      data?: unknown;
    };

const ADMIN_DASHBOARD_STATS_ENDPOINT = "/admin/dashboard/stats";
const ADMIN_PROVIDERS_ENDPOINT = "/admin/providers";
const ADMIN_PROVIDER_DETAILS_ENDPOINT = "/admin/providers";
const ADMIN_SERVICES_ENDPOINT = "/admin/services";

const emptyStats: AdminDashboardStats = {
  totalProviders: 0,
  pendingProviders: 0,
  verifiedProviders: 0,
  pendingDocuments: 0,
  activeServices: 0,
  clientsCount: 0,
  recentActivity: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapStatsPayload = (response: unknown): Record<string, unknown> => {
  if (!isRecord(response)) {
    return {};
  }

  const nestedPayload = response.stats ?? response.dashboardStats ?? response.data;

  if (isRecord(nestedPayload)) {
    if (isRecord(nestedPayload.stats)) {
      return nestedPayload.stats;
    }

    return nestedPayload;
  }

  return response;
};

const readNumber = (source: Record<string, unknown>, keys: string[]): number => {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return 0;
};

const readOptionalNumber = (
  source: Record<string, unknown>,
  keys: string[],
): number | undefined => {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
};

const readString = (
  source: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return undefined;
};

const readBoolean = (
  source: Record<string, unknown>,
  keys: string[],
): boolean | undefined => {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();

      if (["true", "yes", "verified", "approved"].includes(normalizedValue)) {
        return true;
      }

      if (["false", "no", "unverified", "pending"].includes(normalizedValue)) {
        return false;
      }
    }
  }

  return undefined;
};

const readRecord = (
  source: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> | undefined => {
  for (const key of keys) {
    const value = source[key];

    if (isRecord(value)) {
      return value;
    }
  }

  return undefined;
};

const readArray = (
  source: Record<string, unknown>,
  keys: string[],
): unknown[] | undefined => {
  for (const key of keys) {
    const value = source[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return undefined;
};

const normalizeActivityItem = (
  item: unknown,
  index: number,
): AdminRecentActivity | null => {
  if (typeof item === "string" && item.trim()) {
    return {
      id: `activity-${index}`,
      title: item,
    };
  }

  if (!isRecord(item)) {
    return null;
  }

  const title =
    readString(item, ["title", "label", "message", "summary", "action", "event"]) ??
    readString(item, ["type", "category"]) ??
    "Activity update";

  return {
    id: readString(item, ["id", "_id", "activityId"]) ?? `activity-${index}`,
    title,
    description: readString(item, ["description", "details", "body"]),
    occurredAt: readString(item, ["occurredAt", "createdAt", "timestamp", "date"]),
    type: readString(item, ["type", "category"]),
    status: readString(item, ["status", "state"]),
    actor: readString(item, ["actor", "userName", "user", "providerName", "clientName"]),
  };
};

const normalizeRecentActivity = (source: Record<string, unknown>): AdminRecentActivity[] => {
  const value =
    source.recentActivity ??
    source.recent_activity ??
    source.recentActivitySummary ??
    source.recent_activity_summary;

  if (Array.isArray(value)) {
    return value
      .map((item, index) => normalizeActivityItem(item, index))
      .filter((item): item is AdminRecentActivity => Boolean(item));
  }

  const singleItem = normalizeActivityItem(value, 0);
  return singleItem ? [singleItem] : [];
};

const normalizeDashboardStats = (response: unknown): AdminDashboardStats => {
  const source = unwrapStatsPayload(response);

  return {
    ...emptyStats,
    totalProviders: readNumber(source, [
      "totalProviders",
      "total_providers",
      "providersTotal",
      "providers_count",
    ]),
    pendingProviders: readNumber(source, [
      "pendingProviders",
      "pending_providers",
      "providersPending",
    ]),
    verifiedProviders: readNumber(source, [
      "verifiedProviders",
      "verified_providers",
      "providersVerified",
    ]),
    pendingDocuments: readNumber(source, [
      "pendingDocuments",
      "pending_documents",
      "documentsPending",
    ]),
    activeServices: readNumber(source, [
      "activeServices",
      "active_services",
      "servicesActive",
    ]),
    clientsCount: readNumber(source, [
      "clientsCount",
      "clients_count",
      "clientCount",
      "totalClients",
    ]),
    recentActivity: normalizeRecentActivity(source),
  };
};

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await api.get<AdminDashboardStatsApiResponse>(
    ADMIN_DASHBOARD_STATS_ENDPOINT,
    {
      requireAuth: true,
    },
  );

  return normalizeDashboardStats(response);
};

const normalizeProviderType = (value?: string): AdminProviderType | null => {
  if (value === "individual" || value === "company") {
    return value;
  }

  return null;
};

const normalizeProviderVerificationStatus = (
  source: Record<string, unknown>,
): AdminProviderVerificationStatus => {
  const rawStatus = readString(source, [
    "verificationStatus",
    "verification_status",
    "status",
    "providerStatus",
  ])?.toLowerCase();

  if (rawStatus === "verified" || rawStatus === "approved") {
    return "verified";
  }

  if (rawStatus === "pending" || rawStatus === "under_review") {
    return "pending";
  }

  if (rawStatus === "unverified" || rawStatus === "rejected") {
    return "unverified";
  }

  return readBoolean(source, ["isVerified", "is_verified", "verified"])
    ? "verified"
    : "unverified";
};

const normalizeProviderItem = (item: unknown, index: number): AdminProvider | null => {
  if (!isRecord(item)) {
    return null;
  }

  const owner = readRecord(item, ["owner", "user", "ownerUser"]);
  const city = readRecord(item, ["city"]);
  const verificationStatus = normalizeProviderVerificationStatus(item);
  const providerType = normalizeProviderType(readString(item, ["type", "providerType"]));

  return {
    id: readString(item, ["id", "_id", "providerId"]) ?? `provider-${index}`,
    displayName:
      readString(item, ["displayName", "display_name", "name", "businessName"]) ??
      readString(owner ?? {}, ["fullName", "full_name", "name", "email"]) ??
      "Unnamed provider",
    type: providerType,
    verificationStatus,
    isVerified: verificationStatus === "verified",
    ownerName: readString(owner ?? item, ["fullName", "full_name", "ownerName", "name"]),
    ownerEmail: readString(owner ?? item, ["email", "ownerEmail"]),
    city: readString(city ?? item, ["name", "cityName", "city"]),
    address: readString(item, ["address"]),
    servicesCount: readNumber(item, [
      "servicesCount",
      "services_count",
      "activeServices",
      "active_services",
    ]),
    documentsCount: readNumber(item, [
      "documentsCount",
      "documents_count",
      "submittedDocuments",
      "submitted_documents",
    ]),
    createdAt: readString(item, ["createdAt", "created_at"]),
  };
};

const readProvidersPayload = (
  response: AdminProvidersApiResponse,
): { items: unknown[]; total?: number } => {
  if (Array.isArray(response)) {
    return { items: response };
  }

  if (!isRecord(response)) {
    return { items: [] };
  }

  if (Array.isArray(response.providers)) {
    return {
      items: response.providers,
      total: readNumber(response, ["total", "count"]),
    };
  }

  if (Array.isArray(response.items)) {
    return {
      items: response.items,
      total: readNumber(response, ["total", "count"]),
    };
  }

  if (Array.isArray(response.data)) {
    return {
      items: response.data,
      total: readNumber(response, ["total", "count"]),
    };
  }

  if (isRecord(response.data)) {
    const nestedItems = response.data.providers ?? response.data.items;

    if (Array.isArray(nestedItems)) {
      return {
        items: nestedItems,
        total: readNumber(response.data, ["total", "count"]),
      };
    }
  }

  return { items: [] };
};

const normalizeProvidersResponse = (
  response: AdminProvidersApiResponse,
): AdminProvidersResponse => {
  const { items, total } = readProvidersPayload(response);
  const providers = items
    .map((item, index) => normalizeProviderItem(item, index))
    .filter((provider): provider is AdminProvider => Boolean(provider));

  return {
    providers,
    total: total ?? providers.length,
  };
};

const normalizeServiceStatus = (source: Record<string, unknown>): AdminServiceStatus => {
  const rawStatus = readString(source, ["status", "serviceStatus"])?.toLowerCase();

  if (rawStatus === "inactive") {
    return "inactive";
  }

  if (rawStatus === "active") {
    return "active";
  }

  return readBoolean(source, ["isActive", "is_active", "active"]) === false
    ? "inactive"
    : "active";
};

const normalizeServiceItem = (item: unknown, index: number): AdminService | null => {
  if (!isRecord(item)) {
    return null;
  }

  const provider = readRecord(item, ["provider"]);
  const category = readRecord(item, ["category"]);
  const status = normalizeServiceStatus(item);

  return {
    id: readString(item, ["id", "_id", "serviceId"]) ?? `service-${index}`,
    title:
      readString(item, ["title", "name", "serviceName", "service_name"]) ??
      "Untitled service",
    description: readString(item, ["description"]),
    basePrice: readString(item, ["basePrice", "base_price", "price"]) ?? "0.00",
    isActive: status === "active",
    status,
    provider: provider
      ? {
          id: readString(provider, ["id", "_id", "providerId"]) ?? "provider",
          displayName:
            readString(provider, ["displayName", "display_name", "name"]) ??
            "Unnamed provider",
          isVerified: readBoolean(provider, ["isVerified", "is_verified", "verified"]),
        }
      : null,
    category: category
      ? {
          id: readString(category, ["id", "_id", "categoryId"]) ?? "category",
          name: readString(category, ["name", "title"]) ?? "Uncategorized",
        }
      : null,
    coverImageUrl: readString(item, ["coverImageUrl", "cover_image_url", "imageUrl"]),
    createdAt: readString(item, ["createdAt", "created_at"]),
  };
};

const readServicesPayload = (
  response: AdminServicesApiResponse,
): { items: unknown[]; total?: number } => {
  if (Array.isArray(response)) {
    return { items: response };
  }

  if (!isRecord(response)) {
    return { items: [] };
  }

  if (Array.isArray(response.services)) {
    return {
      items: response.services,
      total: readNumber(response, ["total", "count"]),
    };
  }

  if (Array.isArray(response.items)) {
    return {
      items: response.items,
      total: readNumber(response, ["total", "count"]),
    };
  }

  if (Array.isArray(response.data)) {
    return {
      items: response.data,
      total: readNumber(response, ["total", "count"]),
    };
  }

  if (isRecord(response.data)) {
    const nestedItems = response.data.services ?? response.data.items;

    if (Array.isArray(nestedItems)) {
      return {
        items: nestedItems,
        total: readNumber(response.data, ["total", "count"]),
      };
    }
  }

  return { items: [] };
};

const normalizeServicesResponse = (
  response: AdminServicesApiResponse,
): AdminServicesResponse => {
  const { items, total } = readServicesPayload(response);
  const services = items
    .map((item, index) => normalizeServiceItem(item, index))
    .filter((service): service is AdminService => Boolean(service));

  return {
    services,
    total: total ?? services.length,
  };
};

const hasMeaningfulValue = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "boolean") {
    return true;
  }

  return Array.isArray(value) ? value.length > 0 : Boolean(value);
};

const normalizeStringList = (value?: unknown[]): string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (typeof item === "number" && Number.isFinite(item)) {
        return String(item);
      }

      if (isRecord(item)) {
        return (readString(item, ["name", "title", "label", "value"]) ?? "").trim();
      }

      return "";
    })
    .filter((item) => item.length > 0);

  return items.length > 0 ? items : undefined;
};

const normalizeProviderDetailsProvider = (
  source: Record<string, unknown>,
  fallbackSource: Record<string, unknown> = source,
): AdminProviderDetailsProvider => {
  const baseProvider = normalizeProviderItem(source, 0);

  if (!baseProvider) {
    throw new Error("Provider details response did not include provider data.");
  }

  const owner =
    readRecord(source, ["owner", "user", "ownerUser"]) ??
    readRecord(fallbackSource, ["owner", "user", "ownerUser"]);

  return {
    ...baseProvider,
    displayName:
      baseProvider.displayName === "Unnamed provider"
        ? readString(fallbackSource, [
            "displayName",
            "display_name",
            "name",
            "businessName",
          ]) ?? baseProvider.displayName
        : baseProvider.displayName,
    ownerName:
      baseProvider.ownerName ??
      readString(owner ?? source, ["fullName", "full_name", "ownerName", "name"]) ??
      readString(fallbackSource, ["fullName", "full_name", "ownerName", "name"]),
    ownerEmail:
      baseProvider.ownerEmail ??
      readString(owner ?? source, ["email", "ownerEmail"]) ??
      readString(fallbackSource, ["email", "ownerEmail"]),
    city:
      baseProvider.city ??
      readString(source, ["city"]) ??
      readString(fallbackSource, ["city"]),
    address:
      baseProvider.address ??
      readString(source, ["address"]) ??
      readString(fallbackSource, ["address"]),
    createdAt:
      baseProvider.createdAt ??
      readString(source, ["createdAt", "created_at"]) ??
      readString(fallbackSource, ["createdAt", "created_at"]),
    description: readString(source, [
      "description",
      "providerDescription",
      "bio",
      "summary",
    ]) ?? readString(fallbackSource, ["description", "providerDescription", "bio", "summary"]),
    phone:
      readString(owner ?? source, ["phone", "phoneNumber", "mobile"]) ??
      readString(fallbackSource, ["phone", "phoneNumber", "mobile"]),
    tenantId:
      readString(source, ["tenantId", "tenant_id"]) ??
      readString(fallbackSource, ["tenantId", "tenant_id"]),
    updatedAt:
      readString(source, ["updatedAt", "updated_at"]) ??
      readString(fallbackSource, ["updatedAt", "updated_at"]),
    verifiedAt:
      readString(source, ["verifiedAt", "verified_at", "approvedAt"]) ??
      readString(fallbackSource, ["verifiedAt", "verified_at", "approvedAt"]),
    verificationNotes:
      readString(source, ["verificationNotes", "reviewNotes", "notes", "statusNotes"]) ??
      readString(fallbackSource, [
        "verificationNotes",
        "reviewNotes",
        "notes",
        "statusNotes",
      ]),
  };
};

const normalizeProviderDocument = (
  item: unknown,
  index: number,
): AdminProviderDocument | null => {
  if (!isRecord(item)) {
    return null;
  }

  return {
    id: readString(item, ["id", "_id", "documentId"]) ?? `document-${index}`,
    documentType:
      readString(item, [
        "documentType",
        "document_type",
        "type",
        "name",
        "label",
      ]) ?? "Document",
    fileUrl: readString(item, [
      "fileUrl",
      "file_url",
      "url",
      "documentUrl",
      "path",
    ]) ?? "",
    isVerified: readBoolean(item, ["isVerified", "is_verified", "verified"]) ?? false,
    submittedAt: readString(item, [
      "submittedAt",
      "submitted_at",
      "createdAt",
      "created_at",
    ]),
    reviewedAt: readString(item, [
      "reviewedAt",
      "reviewed_at",
      "verifiedAt",
      "verified_at",
    ]),
    reviewNotes: readString(item, [
      "reviewNotes",
      "review_notes",
      "notes",
      "comment",
    ]),
  };
};

const normalizeProviderServiceSummaryItem = (
  item: unknown,
  index: number,
): AdminProviderServiceSummaryItem | null => {
  if (!isRecord(item)) {
    return null;
  }

  const category = readRecord(item, ["category", "serviceCategory"]);
  const status = normalizeServiceStatus(item);

  return {
    id: readString(item, ["id", "_id", "serviceId"]) ?? `service-${index}`,
    title:
      readString(item, ["title", "name", "serviceName", "service_name"]) ??
      "Untitled service",
    category: category
      ? {
          id: readString(category, ["id", "_id", "categoryId"]) ?? "category",
          name: readString(category, ["name", "title"]) ?? "Uncategorized",
        }
      : null,
    basePrice: readString(item, ["basePrice", "base_price", "price"]),
    isActive: status === "active",
    status,
    createdAt: readString(item, ["createdAt", "created_at"]),
    updatedAt: readString(item, ["updatedAt", "updated_at"]),
  };
};

const normalizeProviderCompanyDetails = (
  source: Record<string, unknown>,
): AdminProviderCompanyDetails | null => {
  const companySource = readRecord(source, [
    "companyDetails",
    "company",
    "businessDetails",
    "organizationDetails",
  ]);

  if (!companySource) {
    return null;
  }

  const details: AdminProviderCompanyDetails = {
    id: readString(companySource, ["id", "_id", "companyId", "businessId"]),
    businessName: readString(companySource, [
      "businessName",
      "business_name",
      "name",
      "title",
    ]),
    businessNumber: readString(companySource, [
      "businessNumber",
      "business_number",
      "registrationNumber",
      "registration_number",
    ]),
    website: readString(companySource, ["website", "url"]),
    registrationNumber: readString(companySource, [
      "registrationNumber",
      "registration_number",
    ]),
    taxNumber: readString(companySource, ["taxNumber", "tax_number"]),
    vatNumber: readString(companySource, ["vatNumber", "vat_number"]),
    country: readString(companySource, ["country"]),
    city: readString(companySource, ["city"]),
    address: readString(companySource, ["address"]),
    createdAt: readString(companySource, ["createdAt", "created_at"]),
    updatedAt: readString(companySource, ["updatedAt", "updated_at"]),
  };

  if (!Object.values(details).some(hasMeaningfulValue)) {
    return null;
  }

  return details;
};

const normalizeProviderIndividualDetails = (
  source: Record<string, unknown>,
): AdminProviderIndividualDetails | null => {
  const individualSource = readRecord(source, [
    "individualDetails",
    "individual",
    "personalDetails",
    "personDetails",
  ]);

  if (!individualSource) {
    return null;
  }

  const details: AdminProviderIndividualDetails = {
    id: readString(individualSource, ["id", "_id", "individualId"]),
    professionTitle: readString(individualSource, [
      "professionTitle",
      "profession_title",
      "title",
      "specialty",
    ]),
    yearsOfExperience: readOptionalNumber(individualSource, [
      "yearsOfExperience",
      "years_of_experience",
      "experienceYears",
      "experience_years",
    ]),
    bio: readString(individualSource, ["bio", "description", "summary"]),
    skills: normalizeStringList(
      readArray(individualSource, ["skills", "specialties", "expertise"]),
    ),
    certifications: normalizeStringList(
      readArray(individualSource, ["certifications", "certificates", "licenses"]),
    ),
    createdAt: readString(individualSource, ["createdAt", "created_at"]),
    updatedAt: readString(individualSource, ["updatedAt", "updated_at"]),
  };

  if (!Object.values(details).some(hasMeaningfulValue)) {
    return null;
  }

  return details;
};

const normalizeProviderDocuments = (
  source: Record<string, unknown>,
): AdminProviderDocument[] => {
  const verificationRecord = readRecord(source, [
    "verification",
    "verificationInfo",
    "verificationStatus",
    "verification_summary",
  ]);

  const documentsPayload =
    readArray(source, ["documents", "providerDocuments", "verificationDocuments", "files"]) ??
    (verificationRecord
      ? readArray(verificationRecord, [
          "documents",
          "providerDocuments",
          "verificationDocuments",
          "files",
        ])
      : undefined);

  if (!documentsPayload) {
    return [];
  }

  return documentsPayload
    .map((item, index) => normalizeProviderDocument(item, index))
    .filter((document): document is AdminProviderDocument => Boolean(document));
};

const normalizeProviderServicesSummary = (
  source: Record<string, unknown>,
): AdminProviderServicesSummary => {
  const servicesSummaryRecord = readRecord(source, [
    "servicesSummary",
    "services_summary",
    "serviceSummary",
    "summary",
  ]);
  const servicesPayload =
    readArray(servicesSummaryRecord ?? source, [
      "services",
      "items",
      "serviceItems",
      "providerServices",
    ]) ?? readArray(source, ["services", "items", "serviceItems", "providerServices"]);

  const services = (servicesPayload ?? [])
    .map((item, index) => normalizeProviderServiceSummaryItem(item, index))
    .filter((service): service is AdminProviderServiceSummaryItem => Boolean(service));

  const summarySource = servicesSummaryRecord ?? source;
  const totalServices =
    readNumber(summarySource, [
      "totalServices",
      "total_services",
      "servicesCount",
      "services_count",
      "count",
    ]) || services.length;
  const activeServices =
    readNumber(summarySource, [
      "activeServices",
      "active_services",
      "activeCount",
    ]) ||
    services.filter((service) => service.status === "active").length;
  const inactiveServices =
    readNumber(summarySource, [
      "inactiveServices",
      "inactive_services",
      "inactiveCount",
    ]) ||
    services.filter((service) => service.status === "inactive").length;

  return {
    totalServices: totalServices || services.length,
    activeServices,
    inactiveServices,
    services,
    averagePrice: readString(summarySource, [
      "averagePrice",
      "average_price",
      "avgPrice",
    ]),
  };
};

const normalizeProviderVerificationDetails = (
  source: Record<string, unknown>,
  provider: AdminProviderDetailsProvider,
  documents: AdminProviderDocument[],
): AdminProviderVerificationDetails => {
  const verificationRecord = readRecord(source, [
    "verification",
    "verificationInfo",
    "verificationStatus",
    "verification_summary",
  ]);
  const verificationSource = verificationRecord ?? source;
  const submittedDocuments =
    readNumber(verificationSource, [
      "submittedDocuments",
      "submitted_documents",
      "documentsCount",
      "documents_count",
    ]) || documents.length;
  const verifiedDocuments =
    readNumber(verificationSource, [
      "verifiedDocuments",
      "verified_documents",
    ]) || documents.filter((document) => document.isVerified).length;
  const pendingDocuments =
    readNumber(verificationSource, [
      "pendingDocuments",
      "pending_documents",
    ]) ||
    documents.filter((document) => !document.isVerified).length;
  const rawStatus = readString(verificationSource, [
    "status",
    "verificationStatus",
    "state",
  ])?.toLowerCase();
  const explicitVerified = readBoolean(verificationSource, [
    "isVerified",
    "is_verified",
    "verified",
  ]);
  const isSetupComplete = readBoolean(verificationSource, [
    "isSetupComplete",
    "is_setup_complete",
    "setupComplete",
  ]) ?? submittedDocuments > 0;

  let status: AdminProviderVerificationStatus = "pending";

  if (rawStatus === "verified" || explicitVerified || provider.isVerified) {
    status = "verified";
  } else if (rawStatus === "unverified" || rawStatus === "rejected") {
    status = "unverified";
  } else if (rawStatus === "pending" || !isSetupComplete) {
    status = "pending";
  } else if (documents.some((document) => !document.isVerified)) {
    status = "pending";
  } else {
    status = "unverified";
  }

  const statusLabel =
    readString(verificationSource, ["statusLabel", "label", "displayStatus"]) ??
    (status === "verified"
      ? "Verified"
      : !isSetupComplete
        ? "Setup required"
        : submittedDocuments === 0
          ? "Documents required"
          : status === "pending"
            ? "Under review"
            : "Unverified");

  return {
    isSetupComplete,
    isVerified: status === "verified",
    status,
    statusLabel,
    totalDocuments: readNumber(verificationSource, [
      "totalDocuments",
      "total_documents",
      "documentsCount",
      "documents_count",
    ]) || submittedDocuments,
    submittedDocuments,
    verifiedDocuments,
    pendingDocuments,
    reviewedBy: readString(verificationSource, [
      "reviewedBy",
      "reviewed_by",
      "verifiedBy",
      "verified_by",
      "approvedBy",
      "approved_by",
    ]),
    reviewedAt: readString(verificationSource, [
      "reviewedAt",
      "reviewed_at",
      "verifiedAt",
      "verified_at",
      "approvedAt",
      "approved_at",
    ]),
    notes: readString(verificationSource, [
      "notes",
      "reviewNotes",
      "review_notes",
      "comment",
    ]),
    updatedAt: readString(verificationSource, ["updatedAt", "updated_at"]),
  };
};

const normalizeAdminProviderDetails = (
  response: AdminProviderDetailsApiResponse,
): AdminProviderDetails => {
  const source = isRecord(response) && isRecord(response.data) ? response.data : response;

  if (!isRecord(source)) {
    throw new Error("Provider details response could not be read.");
  }

  const providerSource =
    readRecord(source, ["provider", "providerDetails", "profile", "basicProfile"]) ?? source;
  const detailsSource =
    readRecord(source, ["details", "profileDetails", "providerDetails"]) ?? source;
  const provider = normalizeProviderDetailsProvider(providerSource, source);
  const companyDetails =
    normalizeProviderCompanyDetails(source) ??
    normalizeProviderCompanyDetails(detailsSource) ??
    normalizeProviderCompanyDetails(providerSource);
  const individualDetails =
    normalizeProviderIndividualDetails(source) ??
    normalizeProviderIndividualDetails(detailsSource) ??
    normalizeProviderIndividualDetails(providerSource);
  const providerDocuments = normalizeProviderDocuments(providerSource);
  const detailsDocuments = normalizeProviderDocuments(detailsSource);
  const documents =
    providerDocuments.length > 0
      ? providerDocuments
      : detailsDocuments.length > 0
        ? detailsDocuments
        : normalizeProviderDocuments(source);
  const providerServicesSummary = normalizeProviderServicesSummary(providerSource);
  const detailsServicesSummary = normalizeProviderServicesSummary(detailsSource);
  const servicesSummary =
    providerServicesSummary.services.length > 0 || providerServicesSummary.totalServices > 0
      ? providerServicesSummary
      : detailsServicesSummary.services.length > 0 ||
          detailsServicesSummary.totalServices > 0
        ? detailsServicesSummary
        : normalizeProviderServicesSummary(source);
  const verification = normalizeProviderVerificationDetails(source, provider, documents);

  return {
    provider,
    companyDetails: companyDetails ?? normalizeProviderCompanyDetails(providerSource) ?? null,
    individualDetails:
      individualDetails ?? normalizeProviderIndividualDetails(providerSource) ?? null,
    documents,
    servicesSummary,
    verification,
  };
};

const normalizeServiceActionResponse = (
  response: AdminServiceActionApiResponse,
  fallbackMessage: string,
): AdminServiceActionResponse => {
  const source = isRecord(response) ? response : {};
  const data = source.data;
  const nestedSource = isRecord(data) ? data : source;
  const servicePayload = nestedSource.service ?? data ?? response;
  const service = normalizeServiceItem(servicePayload, 0);

  if (!service) {
    throw new Error("Service action response could not be read.");
  }

  return {
    message: readString(nestedSource, ["message"]) ?? fallbackMessage,
    service,
  };
};

export const getAdminProviders = async (
  query: AdminProvidersQuery = {},
): Promise<AdminProvidersResponse> => {
  const search = query.search?.trim();
  const response = await api.get<AdminProvidersApiResponse>(ADMIN_PROVIDERS_ENDPOINT, {
    query: {
      search: search || undefined,
      verificationStatus: query.verificationStatus,
      type: query.type,
    },
    requireAuth: true,
  });

  return normalizeProvidersResponse(response);
};

export const getAdminServices = async (
  query: AdminServicesQuery = {},
): Promise<AdminServicesResponse> => {
  const search = query.search?.trim();
  const response = await api.get<AdminServicesApiResponse>(ADMIN_SERVICES_ENDPOINT, {
    query: {
      search: search || undefined,
      providerId: query.providerId,
      categoryId: query.categoryId,
      status: query.status,
    },
    requireAuth: true,
  });

  return normalizeServicesResponse(response);
};

export const deactivateAdminService = async (
  serviceId: string | number,
): Promise<AdminServiceActionResponse> => {
  const response = await api.patch<AdminServiceActionApiResponse>(
    `${ADMIN_SERVICES_ENDPOINT}/${serviceId}/deactivate`,
    {
      requireAuth: true,
    },
  );

  return normalizeServiceActionResponse(
    response,
    "Service deactivated successfully.",
  );
};

export const reactivateAdminService = async (
  serviceId: string | number,
): Promise<AdminServiceActionResponse> => {
  const response = await api.patch<AdminServiceActionApiResponse>(
    `${ADMIN_SERVICES_ENDPOINT}/${serviceId}/reactivate`,
    {
      requireAuth: true,
    },
  );

  return normalizeServiceActionResponse(
    response,
    "Service reactivated successfully.",
  );
};

export const getAdminProviderDetails = async (
  providerId: string | number,
): Promise<AdminProviderDetails> => {
  const response = await api.get<AdminProviderDetailsApiResponse>(
    `${ADMIN_PROVIDER_DETAILS_ENDPOINT}/${encodeURIComponent(String(providerId))}`,
    {
      requireAuth: true,
    },
  );

  return normalizeAdminProviderDetails(response);
};

export const adminService = {
  getDashboardStats: getAdminDashboardStats,
  getProviders: getAdminProviders,
  getProviderDetails: getAdminProviderDetails,
  getServices: getAdminServices,
  deactivateService: deactivateAdminService,
  reactivateService: reactivateAdminService,
};
