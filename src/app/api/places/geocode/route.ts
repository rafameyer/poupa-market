import { NextResponse } from "next/server";
import {
  geocodeLocation,
  GoogleGeocodingApiError,
} from "@/lib/google-maps/geocoding";
import { APP_LOCALES, type AppLocale } from "@/lib/i18n/config";
import { createServerSupabaseRouteClient } from "@/lib/supabase/server";

function errorResponse(message: string, status: number, code = "geocoding_error") {
  return NextResponse.json(
    {
      ok: false,
      code,
      error: message,
    },
    { status },
  );
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Please sign in before setting a market location.", 401, "unauthenticated");
  }

  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return errorResponse("We could not read the location request.", 400, "invalid_request");
  }

  const query = typeof payload.query === "string" ? payload.query.trim() : "";
  const locale = APP_LOCALES.includes(payload.locale as AppLocale)
    ? (payload.locale as AppLocale)
    : undefined;

  if (query.length < 2) {
    return errorResponse("Add a city, neighborhood, or postcode.", 422, "invalid_location");
  }

  try {
    const location = await geocodeLocation(query, locale);

    if (!location) {
      return errorResponse("We could not find that location.", 404, "location_not_found");
    }

    return NextResponse.json(
      {
        ok: true,
        location,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof GoogleGeocodingApiError) {
      return errorResponse(error.message, error.status, error.code);
    }

    return errorResponse("Location lookup failed.", 500);
  }
}
