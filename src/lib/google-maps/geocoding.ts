import { getGoogleMapsApiKey } from "@/lib/google-maps/env";

const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export class GoogleGeocodingApiError extends Error {
  constructor(
    message: string,
    public readonly code: "missing_api_key" | "google_geocoding_error",
    public readonly status = 500,
  ) {
    super(message);
  }
}

interface GoogleGeocodingResponse {
  status?: string;
  error_message?: string;
  results?: Array<{
    formatted_address?: string;
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  }>;
}

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  label: string;
}

export async function geocodeLocation(query: string, locale?: string): Promise<GeocodedLocation | null> {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    throw new GoogleGeocodingApiError(
      "Google Maps API key is missing.",
      "missing_api_key",
      503,
    );
  }

  const params = new URLSearchParams({
    address: query,
    key: apiKey,
  });

  if (locale) {
    params.set("language", locale);
  }

  const response = await fetch(`${GEOCODING_URL}?${params.toString()}`, {
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as GoogleGeocodingResponse;

  if (!response.ok || (payload.status && !["OK", "ZERO_RESULTS"].includes(payload.status))) {
    throw new GoogleGeocodingApiError(
      payload.error_message ?? "Google geocoding failed.",
      "google_geocoding_error",
      response.status,
    );
  }

  const result = payload.results?.[0];
  const latitude = result?.geometry?.location?.lat;
  const longitude = result?.geometry?.location?.lng;

  if (
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    typeof longitude !== "number" ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
    label: result?.formatted_address?.trim() || query,
  };
}
