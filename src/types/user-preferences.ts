export interface UserPreferences {
  preferredMarketIds: string[];
  maxDistanceKm?: number;
  currency: "EUR";
  includeNonFavoriteMarkets: boolean;
}
