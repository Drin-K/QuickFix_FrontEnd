import { api } from "@/api/api";
import type { BookingApiItem, CreateBookingPayload } from "@/types/booking.types";

export const createBooking = (payload: CreateBookingPayload): Promise<BookingApiItem> =>
  api.post<BookingApiItem>("/bookings", {
    body: payload,
  });

export const getMyBookings = (): Promise<BookingApiItem[]> => api.get<BookingApiItem[]>("/bookings/my");
