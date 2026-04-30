import { getAuthUser } from "@/utils/auth";

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

const STORAGE_PREFIX = "quickfix_availability_slots";

const getStorageKey = (providerUserId: number) => `${STORAGE_PREFIX}:${providerUserId}`;

const readSlots = (providerUserId: number): AvailabilitySlot[] => {
  const raw = localStorage.getItem(getStorageKey(providerUserId));
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as AvailabilitySlot[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (slot) =>
        slot &&
        typeof slot.id === "number" &&
        typeof slot.startTime === "string" &&
        typeof slot.endTime === "string" &&
        typeof slot.isBooked === "boolean",
    );
  } catch {
    localStorage.removeItem(getStorageKey(providerUserId));
    return [];
  }
};

const writeSlots = (providerUserId: number, slots: AvailabilitySlot[]) => {
  localStorage.setItem(getStorageKey(providerUserId), JSON.stringify(slots));
};

const requireProviderUserId = (): number => {
  const user = getAuthUser();
  if (!user) {
    throw new Error("Authentication is required.");
  }

  if (user.role !== "provider") {
    throw new Error("Only providers can manage availability slots.");
  }

  return user.id;
};

export const listAvailabilitySlots = async (): Promise<AvailabilitySlot[]> => {
  const providerUserId = requireProviderUserId();
  const slots = readSlots(providerUserId);

  return slots.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
};

export const createAvailabilitySlot = async (
  payload: CreateAvailabilitySlotPayload,
): Promise<AvailabilitySlot> => {
  const providerUserId = requireProviderUserId();
  const slots = readSlots(providerUserId);
  const nextId = slots.reduce((maxId, slot) => Math.max(maxId, slot.id), 0) + 1;

  const newSlot: AvailabilitySlot = {
    id: nextId,
    startTime: payload.startTime,
    endTime: payload.endTime,
    isBooked: false,
  };

  writeSlots(providerUserId, [...slots, newSlot]);
  return newSlot;
};

export const deleteAvailabilitySlot = async (slotId: number): Promise<void> => {
  const providerUserId = requireProviderUserId();
  const slots = readSlots(providerUserId);
  const filtered = slots.filter((slot) => slot.id !== slotId);
  writeSlots(providerUserId, filtered);
};

export const availabilityService = {
  list: listAvailabilitySlots,
  create: createAvailabilitySlot,
  remove: deleteAvailabilitySlot,
};

