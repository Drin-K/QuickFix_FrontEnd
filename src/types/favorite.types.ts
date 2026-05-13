export type FavoriteProvider = {
  id: number;
  tenantId: number;
  displayName: string;
  description: string | null;
  isVerified: boolean;
  averageRating: string | null;
};

export type FavoriteItem = {
  id: number;
  providerId: number;
  createdAt: string;
  provider: FavoriteProvider;
};

export type FavoritesResponse = {
  favorites: FavoriteItem[];
};

export type CreateFavoriteResponse = {
  message: string;
  favorite: FavoriteItem;
};

export type RemoveFavoriteResponse = {
  message: string;
  providerId: number;
};
