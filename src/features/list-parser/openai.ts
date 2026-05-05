import { DEFAULT_LIST_PARSER_MODEL } from "@/features/list-parser/constants";
import { shoppingListParserSchema } from "@/features/list-parser/schema";
import { addItemIds, extractStructuredPayload } from "@/features/list-parser/validate";
import type { AppLocale } from "@/lib/i18n/config";
import type { ParsedShoppingItem } from "@/types/shopping-list";

interface OpenAIParseResult {
  items: ParsedShoppingItem[];
  model: string;
}

function getOpenAIConfig() {
  return {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_LIST_PARSER_MODEL || DEFAULT_LIST_PARSER_MODEL,
  };
}

export async function parseShoppingListWithOpenAI(
  text: string,
  locale?: AppLocale,
): Promise<OpenAIParseResult | null> {
  const { apiKey, model } = getOpenAIConfig();

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      input: [
        {
          role: "system",
          content:
            "You parse grocery shopping lists into structured JSON for a mobile grocery savings app. Never invent prices, stores, brands, or market data. Infer sensible grocery quantities and units when the user did not provide them: milk 1 L, eggs 12 unit, rice/flour/sugar/salt 1 kg, chicken 1 kg, bananas 1 kg, bread 1 unit, toilet paper 1 pack, detergent 1 bottle, olive oil 1 L. Use confidence high, medium, or low. Set needsReview true when the item is ambiguous or quantity/unit may need a quick tap. Add concise suggestionGroups only for useful clarification, quantity, or unit choices. Keep normalizedName lowercase and generic. Use only the allowed enum values.",
        },
        {
          role: "user",
          content: `Locale: ${locale ?? "en"}\nParse this grocery shopping list into structured items:\n\n${text}`,
        },
      ],
      max_output_tokens: 2200,
      text: {
        format: {
          type: "json_schema",
          name: "shopping_list_parse",
          strict: true,
          schema: shoppingListParserSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as unknown;
  const parsed = extractStructuredPayload(payload);

  if (!parsed) {
    throw new Error("OpenAI returned an unexpected parser payload.");
  }

  return {
    items: addItemIds(parsed.items),
    model,
  };
}
