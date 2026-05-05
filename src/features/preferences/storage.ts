import { LOCALE_COOKIE_NAME, type AppLocale } from "@/lib/i18n/config";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type {
  PreferredMarketScope,
  UserPreferences,
} from "@/features/preferences/types";
import type { FavoriteMarket, SavedLocation } from "@/types/market";

export const DEFAULT_RADIUS_KM = 5;

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  manualLanguage: null,
  radiusKm: DEFAULT_RADIUS_KM,
  marketScope: "nearby",
  locationLabel: null,
  favoriteMarkets: [],
  lastKnownLocation: null,
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function slugifyFavoriteName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeFavoriteMarkets(value: unknown): FavoriteMarket[] {
  if (isStringArray(value)) {
    return value
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((name) => ({
        placeId: `legacy:${slugifyFavoriteName(name)}`,
        name,
        lastSeenAt: new Date(0).toISOString(),
      }));
  }

  if (!Array.isArray(value)) {
    return [];
  }

  const favorites: FavoriteMarket[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const record = entry as Record<string, unknown>;
    const placeId = typeof record.placeId === "string" ? record.placeId.trim() : "";
    const name = typeof record.name === "string" ? record.name.trim() : "";

    if (!placeId || !name) {
      continue;
    }

    const favorite: FavoriteMarket = {
      placeId,
      name,
      lastSeenAt:
        typeof record.lastSeenAt === "string" && record.lastSeenAt.trim()
          ? record.lastSeenAt
          : new Date(0).toISOString(),
    };
    const address = typeof record.address === "string" ? record.address.trim() : "";
    const googleMapsUri =
      typeof record.googleMapsUri === "string" ? record.googleMapsUri.trim() : "";

    if (address) {
      favorite.address = address;
    }

    favorite.googleMapsUri = googleMapsUri || null;
    favorite.rating =
      typeof record.rating === "number" && Number.isFinite(record.rating)
        ? record.rating
        : null;

    favorites.push(favorite);
  }

  return favorites;
}

function normalizeSavedLocation(value: unknown): SavedLocation | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const latitude = Number(record.latitude);
  const longitude = Number(record.longitude);
  const label = typeof record.label === "string" ? record.label.trim() : "";
  const source = record.source === "manual" ? "manual" : "browser";

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !label) {
    return null;
  }

  return {
    latitude,
    longitude,
    label,
    source,
    updatedAt:
      typeof record.updatedAt === "string" && record.updatedAt.trim()
        ? record.updatedAt
        : new Date(0).toISOString(),
  };
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
    favoriteMarkets: normalizeFavoriteMarkets(record.favoriteMarkets),
    lastKnownLocation: normalizeSavedLocation(record.lastKnownLocation),
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
