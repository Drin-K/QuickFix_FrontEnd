import { api } from "@/api/api";
import type { AvailabilitySlot } from "@/types/booking";

export const availabilityService = {
  listByProvider: (providerId: string) =>
    api.get<AvailabilitySlot[]>(`/providers/${providerId}/availability`),
  create: (providerId: string, payload: Partial<AvailabilitySlot>) =>
    api.post<AvailabilitySlot>(`/providers/${providerId}/availability`, payload),
  update: (slotId: string, payload: Partial<AvailabilitySlot>) =>
    api.put<AvailabilitySlot>(`/availability/${slotId}`, payload),
  remove: (slotId: string) => api.delete<void>(`/availability/${slotId}`),
};
