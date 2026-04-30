import { api } from "@/api/api";

export type AvailabilitySlot = {
  id: number;
  tenantId: number;
  providerId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAvailabilitySlotPayload = {
  startTime: string;
  endTime: string;
};

export const availabilityService = {
  list(): Promise<AvailabilitySlot[]> {
    return api.get<AvailabilitySlot[]>("/provider/availability", {
      requireAuth: true,
    });
  },

  create(payload: CreateAvailabilitySlotPayload): Promise<AvailabilitySlot> {
    return api.post<AvailabilitySlot>("/provider/availability", {
      body: payload,
      requireAuth: true,
    });
  },

  remove(slotId: number): Promise<void> {
    return api.delete<void>(`/provider/availability/${slotId}`, {
      requireAuth: true,
    });
  },
};

