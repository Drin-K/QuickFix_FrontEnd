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
  bookingDate: string;
  totalPrice: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  status: {
    id: number;
    name: string;
  } | null;
  service: {
    id: number;
    title: string;
    basePrice: string;
  } | null;
  provider: {
    id: number;
    displayName: string;
  } | null;
  client: {
    id: number;
    fullName: string;
    email: string;
  } | null;
};
