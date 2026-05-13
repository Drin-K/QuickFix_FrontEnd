export type BookingStatus = "pending" | "confirmed" | "completed";

export type BookingReview = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
};

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

export type CreateReviewPayload = {
  bookingId: number;
  rating: number;
  comment?: string;
};

export type ReviewApiItem = {
  id: number;
  tenantId: number;
  bookingId: number;
  clientUserId: number;
  providerId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  provider: {
    id: number;
    displayName: string;
    averageRating: string | null;
  } | null;
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
  review: BookingReview | null;
};
