export type ConversationParticipant = {
  id: number;
  fullName: string;
  email?: string;
};

export type ConversationProvider = {
  id: number;
  tenantId: number;
  displayName: string;
  description: string | null;
};

export type ConversationListItem = {
  id: number;
  tenantId: number;
  clientUserId: number;
  providerId: number;
  clientUser: ConversationParticipant | null;
  provider: ConversationProvider | null;
  createdAt: string;
};

export type ConversationMessage = {
  id: number;
  tenantId: number;
  conversationId: number;
  senderUserId: number;
  messageTypeId: number;
  content: string;
  sentAt: string;
  senderUser?: ConversationParticipant | null;
  messageType?: {
    id: number;
    name: string;
  } | null;
};

export type ConversationsListResponse = {
  conversations: ConversationListItem[];
};

export type ConversationDetailsResponse = {
  conversation: ConversationListItem;
};

export type ConversationMessagesResponse = {
  messages: ConversationMessage[];
};

export type CreateConversationPayload = {
  serviceId: number;
};

export type CreateConversationResponse = {
  conversation: ConversationListItem;
};

export type SendConversationMessagePayload = {
  content: string;
};

export type SendConversationMessageResponse = {
  message: ConversationMessage;
};
