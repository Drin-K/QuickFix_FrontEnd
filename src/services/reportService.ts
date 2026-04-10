import { api } from "@/api/api";
import type { Report } from "@/types/utility";

export const reportService = {
  list: () => api.get<Report[]>("/reports"),
  create: (payload: Partial<Report>) => api.post<Report>("/reports", payload),
  getById: (id: string) => api.get<Report>(`/reports/${id}`),
};
