import { api } from "@/api/api";
import type { Address } from "@/types/utility";

export const addressService = {
  list: () => api.get<Address[]>("/addresses"),
  getById: (id: string) => api.get<Address>(`/addresses/${id}`),
  create: (payload: Partial<Address>) => api.post<Address>("/addresses", payload),
  update: (id: string, payload: Partial<Address>) => api.put<Address>(`/addresses/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/addresses/${id}`),
};
