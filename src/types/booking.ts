export type BookingStatus =
  | "pending"
  | "accepted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected";

export type AvailabilitySlot = {
  id: string;
  providerId: string;
  startAt: string;
  endAt: string;
  isAvailable: boolean;
  recurrenceRule?: string;
};

export type Booking = {
  id: string;
  tenantId: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: string;
  estimatedEndAt?: string;
  totalPrice?: number;
  currency?: string;
  notes?: string;
  addressId?: string;
  createdAt: string;
  updatedAt: string;
};
