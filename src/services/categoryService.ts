import { api } from "@/api/api";
import type { Category } from "@/types/business";

export const categoryService = {
  list: () => api.get<Category[]>("/categories"),
  getById: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (payload: Partial<Category>) => api.post<Category>("/categories", payload),
  update: (id: string, payload: Partial<Category>) =>
    api.put<Category>(`/categories/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/categories/${id}`),
};
