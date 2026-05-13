import { api } from "@/api/api";
import type { CreateReviewPayload, ReviewApiItem } from "@/types/booking.types";

export type ProviderReviewListItem = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type ProviderReviewsResponse = {
  provider: {
    id: number;
    displayName: string;
    averageRating: string | null;
  };
  summary: {
    averageRating: string | null;
    count: number;
  };
  reviews: ProviderReviewListItem[];
};

export const createReview = (payload: CreateReviewPayload): Promise<ReviewApiItem> =>
  api.post<ReviewApiItem>("/reviews", {
    body: payload,
    requireAuth: true,
  });

export const getProviderReviews = (
  providerId: number,
): Promise<ProviderReviewsResponse> =>
  api.get<ProviderReviewsResponse>(`/providers/${providerId}/reviews`, {
    tenantId: null,
  });
