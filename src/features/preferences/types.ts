import type { AppLocale } from "@/lib/i18n/config";

export type PreferredMarketScope = "favorites" | "nearby";

export interface UserPreferences {
  manualLanguage: AppLocale | null;
  radiusKm: number;
  marketScope: PreferredMarketScope;
  locationLabel: string | null;
  favoriteMarkets: string[];
}
