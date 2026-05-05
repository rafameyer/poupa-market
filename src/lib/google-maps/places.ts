import { getGoogleMapsApiKey } from "@/lib/google-maps/env";
import type { NearbyMarket } from "@/types/market";

const PLACES_NEARBY_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby";
const PLACE_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.regularOpeningHours.openNow",
  "places.businessStatus",
  "places.googleMapsUri",
].join(",");

export class GoogleMapsApiError extends Error {
  constructor(
    message: string,
    public readonly code: "missing_api_key" | "google_places_error",
    public readonly status = 500,
  ) {
    super(message);
  }
}

interface GooglePlace {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  userRatingCount?: number;
  regularOpeningHours?: {
    openNow?: boolean;
  };
  businessStatus?: string;
  googleMapsUri?: string;
}

interface GooglePlacesNearbyResponse {
  places?: GooglePlace[];
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

export interface SearchNearbySupermarketsInput {
  latitude: number;
  longitude: number;
  radiusKm: number;
  locale?: string;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceInKilometers(
  originLatitude: number,
  originLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(destinationLatitude - originLatitude);
  const longitudeDelta = toRadians(destinationLongitude - originLongitude);
  const originLatitudeRadians = toRadians(originLatitude);
  const destinationLatitudeRadians = toRadians(destinationLatitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitudeRadians) *
      Math.cos(destinationLatitudeRadians) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function normalizePlace(
  place: GooglePlace,
  originLatitude: number,
  originLongitude: number,
): NearbyMarket | null {
  const placeId = place.id?.trim();
  const name = place.displayName?.text?.trim();

  if (!placeId || !name) {
    return null;
  }

  const latitude = place.location?.latitude;
  const longitude = place.location?.longitude;
  const hasLocation =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  return {
    placeId,
    name,
    address: place.formattedAddress?.trim() || "Address unavailable",
    distanceKm: hasLocation
      ? Number(distanceInKilometers(originLatitude, originLongitude, latitude, longitude).toFixed(1))
      : null,
    rating: typeof place.rating === "number" && Number.isFinite(place.rating) ? place.rating : null,
    userRatingCount:
      typeof place.userRatingCount === "number" && Number.isFinite(place.userRatingCount)
        ? place.userRatingCount
        : null,
    openNow:
      typeof place.regularOpeningHours?.openNow === "boolean"
        ? place.regularOpeningHours.openNow
        : null,
    businessStatus: place.businessStatus ?? null,
    googleMapsUri: place.googleMapsUri ?? null,
    location: hasLocation ? { latitude, longitude } : null,
  };
}

export async function searchNearbySupermarkets({
  latitude,
  longitude,
  radiusKm,
  locale,
}: SearchNearbySupermarketsInput): Promise<NearbyMarket[]> {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    throw new GoogleMapsApiError(
      "Google Maps API key is missing.",
      "missing_api_key",
      503,
    );
  }

  const response = await fetch(PLACES_NEARBY_SEARCH_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACE_FIELDS,
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    body: JSON.stringify({
      includedTypes: ["supermarket", "grocery_store"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: Math.min(Math.max(radiusKm, 1), 50) * 1000,
        },
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as GooglePlacesNearbyResponse;

  if (!response.ok) {
    throw new GoogleMapsApiError(
      payload.error?.message ?? "Google Places search failed.",
      "google_places_error",
      response.status,
    );
  }

  return (payload.places ?? [])
    .map((place) => normalizePlace(place, latitude, longitude))
    .filter((place): place is NearbyMarket => Boolean(place))
    .sort((first, second) => (first.distanceKm ?? Number.MAX_VALUE) - (second.distanceKm ?? Number.MAX_VALUE));
}
