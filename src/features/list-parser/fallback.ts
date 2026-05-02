import { CATEGORY_KEYWORDS, SHOPPING_UNITS } from "@/features/list-parser/constants";
import type { ParsedShoppingItem, ShoppingItemCategory } from "@/types/shopping-list";

const LEADING_BULLET = /^[\s\-*•·]+/;

const LEADING_QUANTITY_PATTERN =
  /^(\d+(?:[.,]\d+)?)\s*(kg|g|mg|l|ml|cl|pack|packs|pcs|pc|piece|pieces|dozen|bottle|bottles|can|cans|box|boxes|bag|bags)?\s+(.+)$/i;
const TRAILING_MULTIPLIER_PATTERN =
  /^(.+?)\s*(?:x|×)\s*(\d+(?:[.,]\d+)?)\s*(kg|g|mg|l|ml|cl|pack|packs|pcs|pc|piece|pieces|dozen|bottle|bottles|can|cans|box|boxes|bag|bags)?$/i;

function toNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeUnit(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "packs":
      return "pack";
    case "pc":
    case "piece":
    case "pieces":
      return "pcs";
    case "bottles":
      return "bottle";
    case "cans":
      return "can";
    case "boxes":
      return "box";
    case "bags":
      return "bag";
    default:
      return SHOPPING_UNITS.includes(normalized as (typeof SHOPPING_UNITS)[number])
        ? normalized
        : normalized;
  }
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function singularize(value: string) {
  if (value.endsWith("ies") && value.length > 3) {
    return `${value.slice(0, -3)}y`;
  }

  if (value.endsWith("oes") && value.length > 3) {
    return value.slice(0, -2);
  }

  if (value.endsWith("s") && !value.endsWith("ss") && value.length > 2) {
    return value.slice(0, -1);
  }

  return value;
}

function normalizeName(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return singularize(cleaned);
}

function detectCategory(normalizedName: string): ShoppingItemCategory {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    ShoppingItemCategory,
    string[],
  ][]) {
    if (keywords.some((keyword) => normalizedName.includes(keyword))) {
      return category;
    }
  }

  return "other";
}

function parseSingleItem(rawItem: string): ParsedShoppingItem | null {
  const cleanedRaw = rawItem.replace(LEADING_BULLET, "").trim();

  if (!cleanedRaw) {
    return null;
  }

  const leadingMatch = LEADING_QUANTITY_PATTERN.exec(cleanedRaw);
  const trailingMatch = TRAILING_MULTIPLIER_PATTERN.exec(cleanedRaw);

  const quantity = toNumber(leadingMatch?.[1]) ?? toNumber(trailingMatch?.[2]);
  const unit = normalizeUnit(leadingMatch?.[2]) ?? normalizeUnit(trailingMatch?.[3]);
  const rawName = leadingMatch?.[3]?.trim() ?? trailingMatch?.[1]?.trim() ?? cleanedRaw;
  const normalizedName = normalizeName(rawName);

  return {
    id: crypto.randomUUID(),
    rawText: cleanedRaw,
    name: titleCase(rawName),
    normalizedName,
    quantity,
    unit,
    category: detectCategory(normalizedName),
    notes: null,
  };
}

export function fallbackParseShoppingList(text: string) {
  const items = text
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map(parseSingleItem)
    .filter((entry): entry is ParsedShoppingItem => entry !== null);

  if (items.length > 0) {
    return items;
  }

  const singleItem = parseSingleItem(text);

  return singleItem ? [singleItem] : [];
}
