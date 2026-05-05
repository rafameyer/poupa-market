import {
  createParsedShoppingItem,
  normalizeUnit,
} from "@/features/list-parser/inference";
import type { AppLocale } from "@/lib/i18n/config";
import type { ParsedShoppingItem } from "@/types/shopping-list";

const LEADING_BULLET = /^[\s\-*•·]+/;
const LIST_PREFIX = /^(weekly groceries|shopping list|lista|compras|supermercado)\s*:\s*/i;
const LEADING_QUANTITY_PATTERN =
  /^(\d+(?:[.,]\d+)?)\s*(kg|g|mg|l|ml|cl|pack|packs|pcs|pc|piece|pieces|unit|units|unidade|unidades|unidad|bottle|bottles|box|boxes|dozen|duzia|dúzia|docena)?\s+(.+)$/i;
const TRAILING_MULTIPLIER_PATTERN =
  /^(.+?)\s*(?:x|×)\s*(\d+(?:[.,]\d+)?)\s*(kg|g|mg|l|ml|cl|pack|packs|pcs|pc|piece|pieces|unit|units|unidade|unidades|unidad|bottle|bottles|box|boxes|dozen|duzia|dúzia|docena)?$/i;

function toNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function splitListText(text: string) {
  return text
    .replace(LIST_PREFIX, "")
    .split(/\r?\n|,|;|\s+\be\b\s+|\s+\band\b\s+|\s+\by\b\s+/i)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseSingleItem(rawItem: string, locale?: AppLocale): ParsedShoppingItem | null {
  const cleanedRaw = rawItem.replace(LEADING_BULLET, "").trim();

  if (!cleanedRaw) {
    return null;
  }

  const leadingMatch = LEADING_QUANTITY_PATTERN.exec(cleanedRaw);
  const trailingMatch = TRAILING_MULTIPLIER_PATTERN.exec(cleanedRaw);
  const quantity = toNumber(leadingMatch?.[1]) ?? toNumber(trailingMatch?.[2]);
  const unitValue = leadingMatch?.[2] ?? trailingMatch?.[3] ?? null;
  const rawName = leadingMatch?.[3]?.trim() ?? trailingMatch?.[1]?.trim() ?? cleanedRaw;

  return createParsedShoppingItem(cleanedRaw, rawName, {
    explicitQuantity: quantity,
    explicitUnit: unitValue ? normalizeUnit(unitValue) : null,
    locale,
  });
}

export function fallbackParseShoppingList(text: string, locale?: AppLocale) {
  const items = splitListText(text)
    .map((entry) => parseSingleItem(entry, locale))
    .filter((entry): entry is ParsedShoppingItem => entry !== null);

  if (items.length > 0) {
    return items;
  }

  const singleItem = parseSingleItem(text, locale);

  return singleItem ? [singleItem] : [];
}
