import { api } from "@/api/api";
import type { Booking, BookingStatus } from "@/types/booking";

export const bookingService = {
  list: () => api.get<Booking[]>("/bookings"),
  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),
  create: (payload: Partial<Booking>) => api.post<Booking>("/bookings", payload),
  update: (id: string, payload: Partial<Booking>) => api.put<Booking>(`/bookings/${id}`, payload),
  updateStatus: (id: string, status: BookingStatus) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }),
  remove: (id: string) => api.delete<void>(`/bookings/${id}`),
};
