export const SHOPPING_LIST_FREQUENCIES = [
  "weekly",
  "biweekly",
  "monthly",
  "one-off",
] as const;

export const SHOPPING_LIST_SCOPES = ["favorites", "all"] as const;

export const SHOPPING_LIST_STATUSES = ["draft", "active", "completed"] as const;

export const SHOPPING_ITEM_UNITS = [
  "unit",
  "kg",
  "g",
  "L",
  "ml",
  "pack",
  "box",
  "bottle",
  "dozen",
] as const;

export const SHOPPING_ITEM_CATEGORIES = [
  "produce",
  "dairy",
  "meat",
  "bakery",
  "pantry",
  "frozen",
  "beverages",
  "cleaning",
  "personal-care",
  "household",
  "other",
] as const;

export const PARSE_PROVIDERS = ["openai", "fallback"] as const;
export const ITEM_CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;
export const ITEM_SUGGESTION_GROUP_TYPES = [
  "clarification",
  "quantity",
  "unit",
] as const;
export const ITEM_SUGGESTION_PROMPT_KEYS = [
  "whichOne",
  "howMany",
  "whichUnit",
] as const;

export type ShoppingListFrequency = (typeof SHOPPING_LIST_FREQUENCIES)[number];
export type ShoppingListScope = (typeof SHOPPING_LIST_SCOPES)[number];
export type ShoppingListStatus = (typeof SHOPPING_LIST_STATUSES)[number];
export type ShoppingItemUnit = (typeof SHOPPING_ITEM_UNITS)[number];
export type ShoppingItemCategory = (typeof SHOPPING_ITEM_CATEGORIES)[number];
export type ParseProvider = (typeof PARSE_PROVIDERS)[number];
export type ItemConfidence = (typeof ITEM_CONFIDENCE_LEVELS)[number];
export type ItemSuggestionGroupType =
  (typeof ITEM_SUGGESTION_GROUP_TYPES)[number];
export type ItemSuggestionPromptKey =
  (typeof ITEM_SUGGESTION_PROMPT_KEYS)[number];

export interface ItemSuggestionOption {
  id: string;
  label: string;
  value: string;
  updates: Partial<
    Pick<
      ParsedShoppingItem,
      | "name"
      | "normalizedName"
      | "quantity"
      | "unit"
      | "category"
      | "needsReview"
      | "confidence"
    >
  >;
}

export interface ItemSuggestionGroup {
  id: string;
  type: ItemSuggestionGroupType;
  promptKey: ItemSuggestionPromptKey;
  options: ItemSuggestionOption[];
}

export interface ParsedShoppingItem {
  id: string;
  originalText: string;
  rawText: string;
  name: string;
  normalizedName: string;
  quantity: number;
  unit: ShoppingItemUnit;
  category: ShoppingItemCategory;
  confidence: ItemConfidence;
  needsReview: boolean;
  notes: string | null;
  suggestionGroups: ItemSuggestionGroup[];
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
  quantity: number;
  unit: ShoppingItemUnit;
  category: ShoppingItemCategory;
  confidence: ItemConfidence;
  needsReview: boolean;
  notes: string | null;
  suggestionGroups: ItemSuggestionGroup[];
  checked: boolean;
  createdAt: string;
  updatedAt: string;
}
