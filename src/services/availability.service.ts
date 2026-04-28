import { api } from "@/api/api";
import { getAuthUser } from "@/utils/auth";

export type AvailabilitySlotApiItem = {
  id: number;
  tenantId: number;
  providerId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
};

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

const requireProviderUser = () => {
  const user = getAuthUser();

  if (!user) {
    throw new Error("Authentication is required.");
  }

  if (user.role !== "provider") {
    throw new Error("Only providers can manage availability slots.");
  }

  return user;
};

const mapAvailabilitySlot = (slot: AvailabilitySlotApiItem): AvailabilitySlot => ({
  id: slot.id,
  startTime: slot.startTime,
  endTime: slot.endTime,
  isBooked: slot.isBooked,
});

export const listAvailabilitySlots = async (): Promise<AvailabilitySlot[]> => {
  requireProviderUser();

  const slots = await api.get<AvailabilitySlotApiItem[]>("/availability-slots", {
    requireAuth: true,
  });

  return slots
    .map(mapAvailabilitySlot)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
};

export const createAvailabilitySlot = async (
  payload: CreateAvailabilitySlotPayload,
): Promise<AvailabilitySlot> => {
  requireProviderUser();

  const created = await api.post<AvailabilitySlotApiItem>("/availability-slots", {
    body: payload,
    requireAuth: true,
  });

  return mapAvailabilitySlot(created);
};

export const deleteAvailabilitySlot = async (slotId: number): Promise<void> => {
  requireProviderUser();

  await api.delete<unknown>(`/availability-slots/${slotId}`, {
    requireAuth: true,
  });
};

export const availabilityService = {
  list: listAvailabilitySlots,
  create: createAvailabilitySlot,
  remove: deleteAvailabilitySlot,
};
