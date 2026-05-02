import { DEFAULT_LIST_PARSER_MODEL } from "@/features/list-parser/constants";
import { shoppingListParserSchema } from "@/features/list-parser/schema";
import { addItemIds, extractStructuredPayload } from "@/features/list-parser/validate";
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
            "You parse grocery shopping lists into structured JSON. Never invent prices, stores, brands, or quantities. If quantity or unit is not explicit, return null. Keep normalizedName concise, lowercase, and generic. Use only the allowed categories.",
        },
        {
          role: "user",
          content: `Parse this grocery shopping list into structured items:\n\n${text}`,
        },
      ],
      max_output_tokens: 1200,
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
