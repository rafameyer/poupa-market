import type { AppLocale } from "@/lib/i18n/config";
import type { FavoriteMarket, SavedLocation } from "@/types/market";

export type PreferredMarketScope = "favorites" | "nearby";

export interface UserPreferences {
  manualLanguage: AppLocale | null;
  radiusKm: number;
  marketScope: PreferredMarketScope;
  locationLabel: string | null;
  favoriteMarkets: FavoriteMarket[];
  lastKnownLocation: SavedLocation | null;
}
