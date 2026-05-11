import { api } from "@/api/api";
import type {
  ConversationDetailsResponse,
  ConversationMessagesResponse,
  ConversationsListResponse,
  CreateConversationPayload,
  CreateConversationResponse,
  SendConversationMessagePayload,
  SendConversationMessageResponse,
} from "@/types/conversation.types";

export const conversationService = {
  getMyConversations(): Promise<ConversationsListResponse> {
    return api.get<ConversationsListResponse>("/conversations/my", {
      requireAuth: true,
    });
  },

  createConversation(
    payload: CreateConversationPayload,
  ): Promise<CreateConversationResponse> {
    return api.post<CreateConversationResponse>("/conversations", {
      body: payload,
      requireAuth: true,
      tenantId: null,
    });
  },

  getConversation(conversationId: number): Promise<ConversationDetailsResponse> {
    return api.get<ConversationDetailsResponse>(`/conversations/${conversationId}`, {
      requireAuth: true,
    });
  },

  getConversationMessages(
    conversationId: number,
  ): Promise<ConversationMessagesResponse> {
    return api.get<ConversationMessagesResponse>(
      `/conversations/${conversationId}/messages`,
      {
        requireAuth: true,
      },
    );
  },

  sendConversationMessage(
    conversationId: number,
    payload: SendConversationMessagePayload,
  ): Promise<SendConversationMessageResponse> {
    return api.post<SendConversationMessageResponse>(
      `/conversations/${conversationId}/messages`,
      {
        body: payload,
        requireAuth: true,
      },
    );
  },
};
