import { LOCALE_COOKIE_NAME, type AppLocale } from "@/lib/i18n/config";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type {
  PreferredMarketScope,
  UserPreferences,
} from "@/features/preferences/types";

export const DEFAULT_RADIUS_KM = 5;

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  manualLanguage: null,
  radiusKm: DEFAULT_RADIUS_KM,
  marketScope: "nearby",
  locationLabel: null,
  favoriteMarkets: [],
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function normalizeScope(value: unknown): PreferredMarketScope {
  return value === "favorites" ? "favorites" : "nearby";
}

export function normalizeUserPreferences(value: unknown): UserPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_USER_PREFERENCES;
  }

  const record = value as Record<string, unknown>;
  const radiusKm = Number(record.radiusKm);

  return {
    manualLanguage:
      record.manualLanguage === "en" ||
      record.manualLanguage === "pt" ||
      record.manualLanguage === "es"
        ? (record.manualLanguage as AppLocale)
        : null,
    radiusKm: Number.isFinite(radiusKm) && radiusKm > 0 ? radiusKm : DEFAULT_RADIUS_KM,
    marketScope: normalizeScope(record.marketScope),
    locationLabel:
      typeof record.locationLabel === "string" && record.locationLabel.trim()
        ? record.locationLabel.trim()
        : null,
    favoriteMarkets: isStringArray(record.favoriteMarkets)
      ? record.favoriteMarkets.map((entry) => entry.trim()).filter(Boolean)
      : [],
  };
}

export function loadUserPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_USER_PREFERENCES;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEYS.userPreferences);

  if (!rawValue) {
    return DEFAULT_USER_PREFERENCES;
  }

  try {
    return normalizeUserPreferences(JSON.parse(rawValue));
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function saveUserPreferences(preferences: UserPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(preferences));

  if (preferences.manualLanguage) {
    document.cookie = `${LOCALE_COOKIE_NAME}=${preferences.manualLanguage}; path=/; max-age=31536000; samesite=lax`;
  } else {
    document.cookie = `${LOCALE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
  }
}
