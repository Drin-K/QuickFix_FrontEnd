import { api } from "@/api/api";
import type { City } from "@/types/utility";

export const cityService = {
  list: () => api.get<City[]>("/cities"),
  getById: (id: string) => api.get<City>(`/cities/${id}`),
};
