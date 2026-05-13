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

const ADMIN_DASHBOARD_STATS_ENDPOINT = "/admin/dashboard/stats";

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

export const adminService = {
  getDashboardStats: getAdminDashboardStats,
};
