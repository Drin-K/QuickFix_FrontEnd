import { api } from "@/api/api";
import type { User } from "@/types/core";

export const userService = {
  list: () => api.get<User[]>("/users"),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (payload: Partial<User>) => api.post<User>("/users", payload),
  update: (id: string, payload: Partial<User>) => api.put<User>(`/users/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/users/${id}`),
};
