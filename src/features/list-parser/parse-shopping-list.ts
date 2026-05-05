import { fallbackParseShoppingList } from "@/features/list-parser/fallback";
import { parseShoppingListWithOpenAI } from "@/features/list-parser/openai";
import type { AppLocale } from "@/lib/i18n/config";
import type { ParseProvider, ParsedShoppingItem } from "@/types/shopping-list";

interface ParseShoppingListResult {
  items: ParsedShoppingItem[];
  provider: ParseProvider;
  warning: string | null;
}

export async function parseShoppingList(
  text: string,
  locale?: AppLocale,
): Promise<ParseShoppingListResult> {
  try {
    const parsed = await parseShoppingListWithOpenAI(text, locale);

    if (parsed && parsed.items.length > 0) {
      return {
        items: parsed.items,
        provider: "openai",
        warning: null,
      };
    }
  } catch {
    // Fall through to deterministic parsing if the AI request fails.
  }

  return {
    items: fallbackParseShoppingList(text, locale),
    provider: "fallback",
    warning: "madeDraft",
  };
}
