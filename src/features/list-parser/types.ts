import type { ParsedShoppingItem, ParseProvider } from "@/types/shopping-list";

export interface ParseShoppingListRequest {
  text: string;
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
