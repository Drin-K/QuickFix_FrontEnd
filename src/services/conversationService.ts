import { api } from "@/api/api";
import type { Conversation, Message } from "@/types/interaction";

export const conversationService = {
  list: () => api.get<Conversation[]>("/conversations"),
  getById: (id: string) => api.get<Conversation>(`/conversations/${id}`),
  create: (payload: Partial<Conversation>) => api.post<Conversation>("/conversations", payload),
  listMessages: (conversationId: string) =>
    api.get<Message[]>(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, payload: Partial<Message>) =>
    api.post<Message>(`/conversations/${conversationId}/messages`, payload),
};
