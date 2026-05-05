import {
  createParsedShoppingItem,
  normalizeCategory,
  normalizeItemName,
  normalizeUnit,
  toDisplayName,
} from "@/features/list-parser/inference";
import { getItemSuggestionGroups } from "@/features/list-parser/suggestions";
import type { ShoppingListParserSchemaPayload } from "@/features/list-parser/schema";
import {
  ITEM_CONFIDENCE_LEVELS,
  ITEM_SUGGESTION_GROUP_TYPES,
  ITEM_SUGGESTION_PROMPT_KEYS,
  type ItemConfidence,
  type ItemSuggestionGroup,
  type ItemSuggestionOption,
  type ParsedShoppingItem,
} from "@/types/shopping-list";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isConfidence(value: unknown): value is ItemConfidence {
  return (
    typeof value === "string" &&
    ITEM_CONFIDENCE_LEVELS.includes(value as ItemConfidence)
  );
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanSuggestionUpdates(value: unknown): ItemSuggestionOption["updates"] {
  if (!isObject(value)) {
    return {};
  }

  return {
    ...(typeof value.name === "string" && value.name.trim()
      ? { name: value.name.trim() }
      : {}),
    ...(typeof value.normalizedName === "string" && value.normalizedName.trim()
      ? { normalizedName: normalizeItemName(value.normalizedName) }
      : {}),
    ...(normalizeNumber(value.quantity) ? { quantity: normalizeNumber(value.quantity)! } : {}),
    ...(typeof value.unit === "string" ? { unit: normalizeUnit(value.unit) } : {}),
    ...(typeof value.category === "string"
      ? { category: normalizeCategory(value.category) }
      : {}),
    ...(typeof value.needsReview === "boolean"
      ? { needsReview: value.needsReview }
      : {}),
    ...(isConfidence(value.confidence) ? { confidence: value.confidence } : {}),
  };
}

function cleanSuggestionGroups(value: unknown): ItemSuggestionGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((group): ItemSuggestionGroup | null => {
      if (!isObject(group) || !Array.isArray(group.options)) {
        return null;
      }

      if (
        typeof group.type !== "string" ||
        !ITEM_SUGGESTION_GROUP_TYPES.includes(
          group.type as ItemSuggestionGroup["type"],
        ) ||
        typeof group.promptKey !== "string" ||
        !ITEM_SUGGESTION_PROMPT_KEYS.includes(
          group.promptKey as ItemSuggestionGroup["promptKey"],
        )
      ) {
        return null;
      }

      const options = group.options
        .map((entry): ItemSuggestionOption | null => {
          if (!isObject(entry)) {
            return null;
          }

          const id = normalizeString(entry.id);
          const label = normalizeString(entry.label);
          const valueLabel = normalizeString(entry.value) || label;

          if (!id || !label) {
            return null;
          }

          return {
            id,
            label,
            value: valueLabel,
            updates: cleanSuggestionUpdates(entry.updates),
          };
        })
        .filter((entry): entry is ItemSuggestionOption => entry !== null);

      if (options.length === 0) {
        return null;
      }

      return {
        id: normalizeString(group.id) || `${group.type}-${crypto.randomUUID()}`,
        type: group.type as ItemSuggestionGroup["type"],
        promptKey: group.promptKey as ItemSuggestionGroup["promptKey"],
        options,
      };
    })
    .filter((group): group is ItemSuggestionGroup => group !== null);
}

function normalizeParserItem(value: unknown): ParsedShoppingItem | null {
  if (!isObject(value)) {
    return null;
  }

  const rawText = normalizeString(value.rawText) || normalizeString(value.originalText);
  const name = normalizeString(value.name);

  if (!rawText || !name) {
    return null;
  }

  const quantity = normalizeNumber(value.quantity);
  const unit = typeof value.unit === "string" ? normalizeUnit(value.unit) : null;
  const baseItem = createParsedShoppingItem(rawText, name, {
    explicitQuantity: quantity,
    explicitUnit: unit,
  });
  const suggestionGroups =
    cleanSuggestionGroups(value.suggestionGroups).length > 0
      ? cleanSuggestionGroups(value.suggestionGroups)
      : getItemSuggestionGroups(name, undefined, {
          hasExplicitQuantity: quantity !== null,
        });
  const confidence = isConfidence(value.confidence)
    ? value.confidence
    : baseItem.confidence;

  return {
    ...baseItem,
    originalText: normalizeString(value.originalText) || rawText,
    rawText,
    name: toDisplayName(name),
    normalizedName: normalizeString(value.normalizedName)
      ? normalizeItemName(normalizeString(value.normalizedName))
      : baseItem.normalizedName,
    quantity: quantity ?? baseItem.quantity,
    unit: unit ?? baseItem.unit,
    category:
      typeof value.category === "string"
        ? normalizeCategory(value.category)
        : baseItem.category,
    confidence,
    needsReview:
      typeof value.needsReview === "boolean"
        ? value.needsReview || suggestionGroups.length > 0
        : confidence === "low" || suggestionGroups.length > 0,
    notes: typeof value.notes === "string" && value.notes.trim() ? value.notes.trim() : null,
    suggestionGroups,
  };
}

export function isShoppingListParserSchemaPayload(
  value: unknown,
): value is ShoppingListParserSchemaPayload {
  if (!isObject(value) || !Array.isArray(value.items)) {
    return false;
  }

  return value.items.every((item) => normalizeParserItem(item) !== null);
}

export function addItemIds(items: ShoppingListParserSchemaPayload["items"]): ParsedShoppingItem[] {
  return items
    .map(normalizeParserItem)
    .filter((item): item is ParsedShoppingItem => item !== null)
    .map((item) => ({
      ...item,
      id: crypto.randomUUID(),
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
