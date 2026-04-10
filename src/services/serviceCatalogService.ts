import { api } from "@/api/api";
import type { MarketplaceService } from "@/types/business";

export const serviceCatalogService = {
  list: () => api.get<MarketplaceService[]>("/services"),
  getById: (id: string) => api.get<MarketplaceService>(`/services/${id}`),
  create: (payload: Partial<MarketplaceService>) =>
    api.post<MarketplaceService>("/services", payload),
  update: (id: string, payload: Partial<MarketplaceService>) =>
    api.put<MarketplaceService>(`/services/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/services/${id}`),
};
