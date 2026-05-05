import { NextResponse } from "next/server";
import { parseShoppingList } from "@/features/list-parser/parse-shopping-list";
import type {
  ParseShoppingListRequest,
  ParseShoppingListResponse,
} from "@/features/list-parser/types";
import { APP_LOCALES, type AppLocale } from "@/lib/i18n/config";
import { createServerSupabaseRouteClient } from "@/lib/supabase/server";

function errorResponse(message: string, status: number) {
  const body: ParseShoppingListResponse = {
    ok: false,
    error: message,
  };

  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("Please sign in before building a shopping list.", 401);
  }

  let payload: ParseShoppingListRequest;

  try {
    payload = (await request.json()) as ParseShoppingListRequest;
  } catch {
    return errorResponse("We could not read your shopping list request.", 400);
  }

  const text = payload.text?.trim();
  const locale: AppLocale | undefined = APP_LOCALES.includes(
    payload.locale as AppLocale,
  )
    ? (payload.locale as AppLocale)
    : undefined;

  if (!text) {
    return errorResponse("Add at least one grocery item before building the list.", 422);
  }

  const parsed = await parseShoppingList(text, locale);

  if (parsed.items.length === 0) {
    return errorResponse("We could not find grocery items in that text. Try commas or line breaks.", 422);
  }

  const body: ParseShoppingListResponse = {
    ok: true,
    items: parsed.items,
    provider: parsed.provider,
    warning: parsed.warning,
  };

  return NextResponse.json(body, { status: 200 });
}
