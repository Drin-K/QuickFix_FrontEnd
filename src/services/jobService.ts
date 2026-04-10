import { api } from "@/api/api";
import type { BackgroundJob } from "@/types/advanced";

export const jobService = {
  list: () => api.get<BackgroundJob[]>("/jobs"),
  getById: (id: string) => api.get<BackgroundJob>(`/jobs/${id}`),
  retry: (id: string) => api.post<BackgroundJob>(`/jobs/${id}/retry`),
};
