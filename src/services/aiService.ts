import { api } from "@/api/api";
import type { AIRequest, AIResponse } from "@/types/advanced";

export const aiService = {
  generate: (payload: AIRequest) => api.post<AIResponse>("/ai/generate", payload),
};
