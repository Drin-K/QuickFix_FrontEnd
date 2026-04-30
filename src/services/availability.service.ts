import { api } from "@/api/api";

export type AvailabilitySlot = {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export type CreateAvailabilitySlotPayload = {
  startTime: string;
  endTime: string;
};

const PROVIDER_AVAILABILITY_ENDPOINT = "/provider/availability";

export const listAvailabilitySlots = (): Promise<AvailabilitySlot[]> =>
  api.get<AvailabilitySlot[]>(PROVIDER_AVAILABILITY_ENDPOINT, {
    requireAuth: true,
  });

export const createAvailabilitySlot = (
  payload: CreateAvailabilitySlotPayload,
): Promise<AvailabilitySlot> =>
  api.post<AvailabilitySlot>(PROVIDER_AVAILABILITY_ENDPOINT, {
    body: payload,
    requireAuth: true,
  });

export const deleteAvailabilitySlot = (slotId: number): Promise<void> =>
  api.delete<void>(`${PROVIDER_AVAILABILITY_ENDPOINT}/${slotId}`, {
    requireAuth: true,
  });

export const availabilityService = {
  list: listAvailabilitySlots,
  create: createAvailabilitySlot,
  remove: deleteAvailabilitySlot,
};
