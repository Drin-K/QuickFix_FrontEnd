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

<<<<<<< Updated upstream
=======
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

export type AdminServiceActionResponse = {
  message: string;
  service: AdminService;
};

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
const ADMIN_DASHBOARD_STATS_ENDPOINT = "/admin/dashboard/stats";
const ADMIN_PROVIDERS_ENDPOINT = "/admin/providers";

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

<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export const adminService = {
  getDashboardStats: getAdminDashboardStats,
  getProviders: getAdminProviders,
=======
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

export const adminService = {
  getDashboardStats: getAdminDashboardStats,
  getProviders: getAdminProviders,
  getServices: getAdminServices,
  deactivateService: deactivateAdminService,
  reactivateService: reactivateAdminService,
>>>>>>> Stashed changes
};
