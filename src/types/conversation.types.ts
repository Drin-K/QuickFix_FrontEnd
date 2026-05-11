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

export type ConversationsListResponse = {
  conversations: ConversationListItem[];
};

export type CreateConversationPayload = {
  serviceId: number;
};

export type CreateConversationResponse = {
  conversation: ConversationListItem;
};
