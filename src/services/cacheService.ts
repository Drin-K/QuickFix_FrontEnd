import { api } from "@/api/api";
import type { CacheEntry } from "@/types/advanced";

export const cacheService = {
  list: () => api.get<CacheEntry[]>("/cache"),
  clearByKey: (key: string) => api.delete<void>(`/cache/${key}`),
  clearAll: () => api.delete<void>("/cache"),
};
