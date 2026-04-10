import { api } from "@/api/api";
import type { MarketplaceService, ProviderProfile } from "@/types/business";
import type { SearchFilters, SearchResult } from "@/types/advanced";

export const searchService = {
  searchProviders: (filters: SearchFilters) =>
    api.post<SearchResult<ProviderProfile>>("/search/providers", filters),
  searchServices: (filters: SearchFilters) =>
    api.post<SearchResult<MarketplaceService>>("/search/services", filters),
};
