import {
  SHOPPING_ITEM_CATEGORIES,
  type ParsedShoppingItem,
} from "@/types/shopping-list";

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
          "rawText",
          "name",
          "normalizedName",
          "quantity",
          "unit",
          "category",
          "notes",
        ],
        properties: {
          rawText: { type: "string" },
          name: { type: "string" },
          normalizedName: { type: "string" },
          quantity: {
            anyOf: [{ type: "number" }, { type: "null" }],
          },
          unit: {
            anyOf: [{ type: "string" }, { type: "null" }],
          },
          category: {
            type: "string",
            enum: [...SHOPPING_ITEM_CATEGORIES],
          },
          notes: {
            anyOf: [{ type: "string" }, { type: "null" }],
          },
        },
      },
    },
  },
} as const;

export interface ShoppingListParserSchemaPayload {
  items: Omit<ParsedShoppingItem, "id">[];
}
