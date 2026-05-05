import type { ParsedShoppingItem, ParseProvider } from "@/types/shopping-list";
import type { AppLocale } from "@/lib/i18n/config";

export interface ParseShoppingListRequest {
  text: string;
  locale?: AppLocale;
}

export interface ParseShoppingListSuccessResponse {
  ok: true;
  items: ParsedShoppingItem[];
  provider: ParseProvider;
  warning: string | null;
}

export interface ParseShoppingListErrorResponse {
  ok: false;
  error: string;
}

export type ParseShoppingListResponse =
  | ParseShoppingListSuccessResponse
  | ParseShoppingListErrorResponse;
