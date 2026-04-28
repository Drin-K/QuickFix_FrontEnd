import { api } from "@/api/api";
import type { BookingApiItem, BookingStatus, CreateBookingPayload } from "@/types/booking.types";

export const createBooking = (
  payload: CreateBookingPayload,
): Promise<BookingApiItem> =>
  api.post<BookingApiItem>("/bookings", {
    body: payload,
    requireAuth: true,
  });

export const getMyBookings = (): Promise<BookingApiItem[]> =>
  api.get<BookingApiItem[]>("/bookings/my", { requireAuth: true });

export const getProviderBookings = (): Promise<BookingApiItem[]> =>
  api.get<BookingApiItem[]>("/bookings/provider", { requireAuth: true });

export type UpdateBookingStatusPayload = {
  status: BookingStatus | string;
};

export const updateBookingStatus = (
  bookingId: number,
  payload: UpdateBookingStatusPayload,
): Promise<BookingApiItem> =>
  api.patch<BookingApiItem>(`/bookings/${bookingId}/status`, {
    body: payload,
    requireAuth: true,
  });
