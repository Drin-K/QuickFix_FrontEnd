import { api } from "@/api/api";
import type { Role } from "@/types/core";

export const roleService = {
  list: () => api.get<Role[]>("/roles"),
  getById: (id: string) => api.get<Role>(`/roles/${id}`),
  create: (payload: Partial<Role>) => api.post<Role>("/roles", payload),
  update: (id: string, payload: Partial<Role>) => api.put<Role>(`/roles/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/roles/${id}`),
};
