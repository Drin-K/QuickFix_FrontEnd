import { ApiError } from "@/api/api";
import { ClientLayout } from "@/layouts/ClientLayout";
import { routePaths } from "@/routes/routePaths";
import { favoriteService } from "@/services/favorite.service";
import type { FavoriteItem } from "@/types/favorite.types";
import { clearAuthSession } from "@/utils/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingProviderId, setPendingProviderId] = useState<number | null>(null);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await favoriteService.getMyFavorites();
      setFavorites(response.favorites);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We could not load your favorite providers right now.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFavorite = async (providerId: number) => {
    try {
      setPendingProviderId(providerId);
      setErrorMessage("");
      await favoriteService.removeFavorite(providerId);
      setFavorites((current) =>
        current.filter((favorite) => favorite.providerId !== providerId),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We could not remove this provider from favorites.");
      }
    } finally {
      setPendingProviderId(null);
    }
  };

  return (
    <ClientLayout>
      <section className="section favorites-page">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Favorite providers</span>
            <h1>Your saved providers</h1>
            <p>
              Keep the providers you trust in one place, then return to the marketplace
              whenever you are ready to book a service.
            </p>
          </div>

          {isLoading ? <p>Loading your favorites...</p> : null}
          {!isLoading && errorMessage ? (
            <p className="auth-form__error">{errorMessage}</p>
          ) : null}
          {!isLoading && !errorMessage && favorites.length === 0 ? (
            <div className="favorites-page__empty">
              <h2>No favorite providers yet</h2>
              <p>
                Save providers from service cards or service details and they will show up
                here.
              </p>
              <Link className="button" to={routePaths.services}>
                Explore marketplace
              </Link>
            </div>
          ) : null}

          <div className="favorites-page__grid">
            {favorites.map((favorite) => (
              <article key={favorite.id} className="favorite-provider-card">
                <div className="favorite-provider-card__header">
                  <div>
                    <span className="eyebrow">Provider #{favorite.provider.id}</span>
                    <h2>{favorite.provider.displayName}</h2>
                  </div>
                  <span
                    className={`favorite-provider-card__badge ${
                      favorite.provider.isVerified
                        ? "favorite-provider-card__badge--verified"
                        : ""
                    }`}
                  >
                    {favorite.provider.isVerified ? "Verified" : "Pending verification"}
                  </span>
                </div>

                <p>
                  {favorite.provider.description ??
                    "This provider has not added a public description yet."}
                </p>

                <div className="favorite-provider-card__meta">
                  <div>
                    <strong>Tenant</strong>
                    <span>{favorite.provider.tenantId}</span>
                  </div>
                  <div>
                    <strong>Rating</strong>
                    <span>{favorite.provider.averageRating ?? "No ratings yet"}</span>
                  </div>
                </div>

                <div className="favorite-provider-card__actions">
                  <Link className="service-card__link" to={routePaths.services}>
                    Browse marketplace
                  </Link>
                  <button
                    className="service-card__favorite service-card__favorite--active"
                    disabled={pendingProviderId === favorite.providerId}
                    type="button"
                    onClick={() => void handleRemoveFavorite(favorite.providerId)}
                  >
                    {pendingProviderId === favorite.providerId
                      ? "Removing..."
                      : "Remove favorite"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};
