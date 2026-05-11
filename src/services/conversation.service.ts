import { api } from "@/api/api";
import type {
  ConversationsListResponse,
  CreateConversationPayload,
  CreateConversationResponse,
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
};
