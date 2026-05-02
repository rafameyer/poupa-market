import type { ShoppingListParserSchemaPayload } from "@/features/list-parser/schema";
import { SHOPPING_ITEM_CATEGORIES, type ParsedShoppingItem } from "@/types/shopping-list";

function isStringOrNull(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isNumberOrNull(value: unknown): value is number | null {
  return (typeof value === "number" && Number.isFinite(value)) || value === null;
}

function isCategory(value: unknown) {
  return (
    typeof value === "string" &&
    SHOPPING_ITEM_CATEGORIES.includes(value as (typeof SHOPPING_ITEM_CATEGORIES)[number])
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isParserItem(value: unknown) {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.rawText === "string" &&
    typeof value.name === "string" &&
    typeof value.normalizedName === "string" &&
    isNumberOrNull(value.quantity) &&
    isStringOrNull(value.unit) &&
    isCategory(value.category) &&
    isStringOrNull(value.notes)
  );
}

export function isShoppingListParserSchemaPayload(
  value: unknown,
): value is ShoppingListParserSchemaPayload {
  if (!isObject(value) || !Array.isArray(value.items)) {
    return false;
  }

  return value.items.every(isParserItem);
}

export function addItemIds(items: ShoppingListParserSchemaPayload["items"]): ParsedShoppingItem[] {
  return items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    normalizedName: item.normalizedName.trim().toLowerCase(),
    name: item.name.trim(),
    rawText: item.rawText.trim(),
    unit: item.unit?.trim().toLowerCase() ?? null,
    notes: item.notes?.trim() || null,
  }));
}

export function extractStructuredPayload(payload: unknown) {
  if (!isObject(payload)) {
    return null;
  }

  if (isShoppingListParserSchemaPayload(payload.output_parsed)) {
    return payload.output_parsed;
  }

  if (typeof payload.output_text === "string") {
    try {
      const parsed = JSON.parse(payload.output_text) as unknown;
      return isShoppingListParserSchemaPayload(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  if (!Array.isArray(payload.output)) {
    return null;
  }

  for (const item of payload.output) {
    if (!isObject(item) || !Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (!isObject(content)) {
        continue;
      }

      if (typeof content.text === "string") {
        try {
          const parsed = JSON.parse(content.text) as unknown;

          if (isShoppingListParserSchemaPayload(parsed)) {
            return parsed;
          }
        } catch {
          // Ignore malformed text blocks and keep checking.
        }
      }

      if (isShoppingListParserSchemaPayload(content.json)) {
        return content.json;
      }
    }
  }

  return null;
}
