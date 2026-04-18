export type BookingStatus = "pending" | "confirmed" | "completed";

export type BookingListItem = {
  id: number;
  serviceTitle: string;
  providerName: string;
  bookingDate: string;
  status: BookingStatus;
  totalPrice: number;
};
