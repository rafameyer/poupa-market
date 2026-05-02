export const SHOPPING_LIST_FREQUENCIES = [
  "weekly",
  "biweekly",
  "monthly",
  "one-off",
] as const;

export const SHOPPING_LIST_SCOPES = ["favorites", "all"] as const;

export const SHOPPING_LIST_STATUSES = ["draft", "pending", "completed"] as const;

export const SHOPPING_ITEM_CATEGORIES = [
  "produce",
  "bakery",
  "dairy",
  "protein",
  "pantry",
  "frozen",
  "beverages",
  "household",
  "personal-care",
  "snacks",
  "other",
] as const;

export const PARSE_PROVIDERS = ["openai", "fallback"] as const;

export type ShoppingListFrequency = (typeof SHOPPING_LIST_FREQUENCIES)[number];
export type ShoppingListScope = (typeof SHOPPING_LIST_SCOPES)[number];
export type ShoppingListStatus = (typeof SHOPPING_LIST_STATUSES)[number];
export type ShoppingItemCategory = (typeof SHOPPING_ITEM_CATEGORIES)[number];
export type ParseProvider = (typeof PARSE_PROVIDERS)[number];

export interface ParsedShoppingItem {
  id: string;
  rawText: string;
  name: string;
  normalizedName: string;
  quantity: number | null;
  unit: string | null;
  category: ShoppingItemCategory;
  notes: string | null;
}

export interface ShoppingListDraft {
  name: string;
  frequency: ShoppingListFrequency;
  marketScope: ShoppingListScope;
  radiusKm: number;
  sourceText: string;
  parsedItems: ParsedShoppingItem[];
  parseProvider: ParseProvider;
  parseWarning: string | null;
}

export interface ShoppingList {
  id: string;
  name: string;
  frequency: ShoppingListFrequency;
  marketScope: ShoppingListScope;
  radiusKm: number;
  status: ShoppingListStatus;
  sourceText: string;
  itemCount: number;
  parseProvider: ParseProvider;
  parseWarning: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  shoppingListId: string;
  rawText: string;
  name: string;
  normalizedName: string;
  quantity: number | null;
  unit: string | null;
  category: ShoppingItemCategory;
  notes: string | null;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
}
