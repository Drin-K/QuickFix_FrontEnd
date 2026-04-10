import { api } from "@/api/api";
import type { ProviderProfile } from "@/types/business";

export const providerService = {
  list: () => api.get<ProviderProfile[]>("/providers"),
  getById: (id: string) => api.get<ProviderProfile>(`/providers/${id}`),
  create: (payload: Partial<ProviderProfile>) => api.post<ProviderProfile>("/providers", payload),
  update: (id: string, payload: Partial<ProviderProfile>) =>
    api.put<ProviderProfile>(`/providers/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/providers/${id}`),
};
