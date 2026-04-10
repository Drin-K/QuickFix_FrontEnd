export type Review = {
  id: string;
  bookingId: string;
  clientId: string;
  providerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  tenantId: string;
  participantIds: string[];
  bookingId?: string;
  lastMessageAt?: string;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
};

export type NotificationChannel = "in_app" | "email" | "sms" | "push";

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  isRead: boolean;
  createdAt: string;
};
