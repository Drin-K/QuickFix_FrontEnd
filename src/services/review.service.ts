import { api } from "@/api/api";
import type { CreateReviewPayload, ReviewApiItem } from "@/types/booking.types";

export const createReview = (payload: CreateReviewPayload): Promise<ReviewApiItem> =>
  api.post<ReviewApiItem>("/reviews", {
    body: payload,
    requireAuth: true,
  });
