import { api } from "@/api/api";
import type { AppNotification } from "@/types/interaction";

export const notificationService = {
  list: () => api.get<AppNotification[]>("/notifications"),
  markAsRead: (id: string) => api.patch<AppNotification>(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch<void>("/notifications/read-all"),
};
