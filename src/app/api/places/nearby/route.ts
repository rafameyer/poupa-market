import { NextResponse } from "next/server";
import { APP_LOCALES, type AppLocale } from "@/lib/i18n/config";
import {
  GoogleMapsApiError,
  searchNearbySupermarkets,
} from "@/lib/google-maps/places";
import { createServerSupabaseRouteClient } from "@/lib/supabase/server";

function errorResponse(message: string, status: number, code = "places_error") {
  return NextResponse.json(
    {
      ok: false,
      code,
      error: message,
    },
    { status },
  );
}

function isValidCoordinate(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max;
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Please sign in before searching nearby markets.", 401, "unauthenticated");
  }

  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse("We could not read the market search request.", 400, "invalid_request");
  }

  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);
  const radiusKm = Number(payload.radiusKm);
  const locale = APP_LOCALES.includes(payload.locale as AppLocale)
    ? (payload.locale as AppLocale)
    : undefined;

  if (!isValidCoordinate(latitude, -90, 90) || !isValidCoordinate(longitude, -180, 180)) {
    return errorResponse("Add a valid location before searching nearby markets.", 422, "invalid_location");
  }

  if (!Number.isFinite(radiusKm) || radiusKm <= 0 || radiusKm > 50) {
    return errorResponse("Choose a radius between 1 km and 50 km.", 422, "invalid_radius");
  }

  try {
    const markets = await searchNearbySupermarkets({
      latitude,
      longitude,
      radiusKm,
      locale,
    });

    return NextResponse.json(
      {
        ok: true,
        markets,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof GoogleMapsApiError) {
      return errorResponse(error.message, error.status, error.code);
    }

    return errorResponse("Nearby market search failed.", 500);
  }
}
