export type BookingStatus = "pending" | "confirmed" | "completed";

export type BookingListItem = {
  id: number;
  serviceTitle: string;
  providerName: string;
  bookingDate: string;
  status: BookingStatus;
  totalPrice: number;
};

export type CreateBookingPayload = {
  serviceId: number;
  bookingDate: string;
  notes?: string;
};

export type BookingApiItem = {
  id: number;
  tenantId: number;
  clientUserId: number;
  providerId: number;
  serviceId: number;
  statusId: number;
  bookingDate: string;
  totalPrice: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
