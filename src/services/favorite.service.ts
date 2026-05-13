import { api } from "@/api/api";
import type {
  CreateFavoriteResponse,
  FavoritesResponse,
  RemoveFavoriteResponse,
} from "@/types/favorite.types";

export const favoriteService = {
  getMyFavorites(): Promise<FavoritesResponse> {
    return api.get<FavoritesResponse>("/favorites/my", {
      requireAuth: true,
    });
  },

  addFavorite(providerId: number): Promise<CreateFavoriteResponse> {
    return api.post<CreateFavoriteResponse>("/favorites", {
      body: { providerId },
      requireAuth: true,
    });
  },

  removeFavorite(providerId: number): Promise<RemoveFavoriteResponse> {
    return api.delete<RemoveFavoriteResponse>(`/favorites/${providerId}`, {
      requireAuth: true,
    });
  },
};
