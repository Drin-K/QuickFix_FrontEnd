import { api } from "@/api/api";
import type { ClientProfile } from "@/types/business";

export const clientService = {
  list: () => api.get<ClientProfile[]>("/clients"),
  getById: (id: string) => api.get<ClientProfile>(`/clients/${id}`),
  create: (payload: Partial<ClientProfile>) => api.post<ClientProfile>("/clients", payload),
  update: (id: string, payload: Partial<ClientProfile>) =>
    api.put<ClientProfile>(`/clients/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/clients/${id}`),
};
