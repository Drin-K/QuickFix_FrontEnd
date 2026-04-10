import { api } from "@/api/api";
import type { Tenant } from "@/types/core";

export const tenantService = {
  list: () => api.get<Tenant[]>("/tenants"),
  getById: (id: string) => api.get<Tenant>(`/tenants/${id}`),
  create: (payload: Partial<Tenant>) => api.post<Tenant>("/tenants", payload),
  update: (id: string, payload: Partial<Tenant>) => api.put<Tenant>(`/tenants/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/tenants/${id}`),
};
