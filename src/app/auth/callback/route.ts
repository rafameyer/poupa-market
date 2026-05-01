import { NextResponse } from "next/server";
import { createServerSupabaseRouteClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error");
  const authErrorDescription = searchParams.get("error_description");
  const safeNext = next.startsWith("/") ? next : "/dashboard";

  if (authError) {
    const message = authErrorDescription
      ? `Google sign-in failed: ${authErrorDescription.replace(/\+/g, " ")}`
      : "Google sign-in failed. Please try again.";

    return NextResponse.redirect(
      new URL(`/login?message=${encodeURIComponent(message)}`, origin),
    );
  }

  if (code) {
    const supabase = await createServerSupabaseRouteClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(safeNext, origin));
    }

    return NextResponse.redirect(
      new URL(
        `/login?message=${encodeURIComponent(`Google sign-in failed: ${error.message}`)}`,
        origin,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(
      "/login?message=Authentication%20failed.%20Please%20try%20again.",
      origin,
    ),
  );
}
