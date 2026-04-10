export type SearchFilters = {
  query?: string;
  cityId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableFrom?: string;
};

export type SearchResult<T> = {
  total: number;
  items: T[];
};

export type AIRequest = {
  prompt: string;
  context?: string;
};

export type AIResponse = {
  content: string;
  provider: "openai";
  createdAt: string;
};

export type CacheEntry<T = unknown> = {
  key: string;
  value: T;
  expiresAt?: string;
};

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export type BackgroundJob = {
  id: string;
  name: string;
  status: JobStatus;
  payload?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
