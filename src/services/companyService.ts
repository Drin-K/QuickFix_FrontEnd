import { api } from "@/api/api";
import type { Company } from "@/types/business";

export const companyService = {
  list: () => api.get<Company[]>("/companies"),
  getById: (id: string) => api.get<Company>(`/companies/${id}`),
  create: (payload: Partial<Company>) => api.post<Company>("/companies", payload),
  update: (id: string, payload: Partial<Company>) => api.put<Company>(`/companies/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/companies/${id}`),
};
