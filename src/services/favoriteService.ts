import { api } from "@/api/api";
import type { Favorite } from "@/types/utility";

export const favoriteService = {
  list: () => api.get<Favorite[]>("/favorites"),
  create: (payload: Partial<Favorite>) => api.post<Favorite>("/favorites", payload),
  remove: (id: string) => api.delete<void>(`/favorites/${id}`),
};
