import { api } from "@/api/api";
import type { Review } from "@/types/interaction";

export const reviewService = {
  list: () => api.get<Review[]>("/reviews"),
  listByProvider: (providerId: string) => api.get<Review[]>(`/providers/${providerId}/reviews`),
  create: (payload: Partial<Review>) => api.post<Review>("/reviews", payload),
  remove: (id: string) => api.delete<void>(`/reviews/${id}`),
};
