import {
  ITEM_CONFIDENCE_LEVELS,
  ITEM_SUGGESTION_GROUP_TYPES,
  ITEM_SUGGESTION_PROMPT_KEYS,
  SHOPPING_ITEM_CATEGORIES,
  SHOPPING_ITEM_UNITS,
  type ItemConfidence,
  type ItemSuggestionGroup,
  type ItemSuggestionGroupType,
  type ItemSuggestionPromptKey,
  type ShoppingItemCategory,
  type ShoppingItemUnit,
} from "@/types/shopping-list";

const nullableString = {
  anyOf: [{ type: "string" }, { type: "null" }],
} as const;

const nullableNumber = {
  anyOf: [{ type: "number" }, { type: "null" }],
} as const;

const nullableBoolean = {
  anyOf: [{ type: "boolean" }, { type: "null" }],
} as const;

export const shoppingListParserSchema = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "originalText",
          "rawText",
          "name",
          "normalizedName",
          "quantity",
          "unit",
          "category",
          "confidence",
          "needsReview",
          "notes",
          "suggestionGroups",
        ],
        properties: {
          originalText: { type: "string" },
          rawText: { type: "string" },
          name: { type: "string" },
          normalizedName: { type: "string" },
          quantity: { type: "number" },
          unit: {
            type: "string",
            enum: [...SHOPPING_ITEM_UNITS],
          },
          category: {
            type: "string",
            enum: [...SHOPPING_ITEM_CATEGORIES],
          },
          confidence: {
            type: "string",
            enum: [...ITEM_CONFIDENCE_LEVELS],
          },
          needsReview: { type: "boolean" },
          notes: nullableString,
          suggestionGroups: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "type", "promptKey", "options"],
              properties: {
                id: { type: "string" },
                type: {
                  type: "string",
                  enum: [...ITEM_SUGGESTION_GROUP_TYPES],
                },
                promptKey: {
                  type: "string",
                  enum: [...ITEM_SUGGESTION_PROMPT_KEYS],
                },
                options: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["id", "label", "value", "updates"],
                    properties: {
                      id: { type: "string" },
                      label: { type: "string" },
                      value: { type: "string" },
                      updates: {
                        type: "object",
                        additionalProperties: false,
                        required: [
                          "name",
                          "normalizedName",
                          "quantity",
                          "unit",
                          "category",
                          "needsReview",
                          "confidence",
                        ],
                        properties: {
                          name: nullableString,
                          normalizedName: nullableString,
                          quantity: nullableNumber,
                          unit: {
                            anyOf: [
                              { type: "string", enum: [...SHOPPING_ITEM_UNITS] },
                              { type: "null" },
                            ],
                          },
                          category: {
                            anyOf: [
                              { type: "string", enum: [...SHOPPING_ITEM_CATEGORIES] },
                              { type: "null" },
                            ],
                          },
                          needsReview: nullableBoolean,
                          confidence: {
                            anyOf: [
                              { type: "string", enum: [...ITEM_CONFIDENCE_LEVELS] },
                              { type: "null" },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

export interface ShoppingListParserSchemaItem {
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

export interface ShoppingListParserSchemaPayload {
  items: ShoppingListParserSchemaItem[];
}

export type ParserSuggestionGroupShape = {
  id: string;
  type: ItemSuggestionGroupType;
  promptKey: ItemSuggestionPromptKey;
  options: ItemSuggestionGroup["options"];
};
