import { CATEGORY_KEYWORDS, SHOPPING_UNITS } from "@/features/list-parser/constants";
import { getItemSuggestionGroups } from "@/features/list-parser/suggestions";
import type { AppLocale } from "@/lib/i18n/config";
import {
  SHOPPING_ITEM_CATEGORIES,
  type ItemConfidence,
  type ParsedShoppingItem,
  type ShoppingItemCategory,
  type ShoppingItemUnit,
} from "@/types/shopping-list";

const UNIT_ALIASES: Record<string, ShoppingItemUnit> = {
  units: "unit",
  unidade: "unit",
  unidades: "unit",
  unidad: "unit",
  pcs: "unit",
  pc: "unit",
  piece: "unit",
  pieces: "unit",
  l: "L",
  liter: "L",
  liters: "L",
  litre: "L",
  litres: "L",
  litro: "L",
  litros: "L",
  packs: "pack",
  pacote: "pack",
  pacotes: "pack",
  paquete: "pack",
  paquetes: "pack",
  boxes: "box",
  caixa: "box",
  cajas: "box",
  garrafa: "bottle",
  garrafas: "bottle",
  botella: "bottle",
  botellas: "bottle",
  bottles: "bottle",
  dozen: "dozen",
  dúzia: "dozen",
  duzia: "dozen",
  docena: "dozen",
};

interface DefaultInference {
  quantity: number;
  unit: ShoppingItemUnit;
  category: ShoppingItemCategory;
  confidence: ItemConfidence;
}

interface InferenceOptions {
  explicitQuantity?: number | null;
  explicitUnit?: string | null;
  locale?: AppLocale;
}

function cleanComparable(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeItemName(value: string) {
  const cleaned = cleanComparable(value);

  if (cleaned.endsWith("ies") && cleaned.length > 3) {
    return `${cleaned.slice(0, -3)}y`;
  }

  if (cleaned.endsWith("oes") && cleaned.length > 3) {
    return cleaned.slice(0, -2);
  }

  if (cleaned.endsWith("s") && !cleaned.endsWith("ss") && cleaned.length > 2) {
    return cleaned.slice(0, -1);
  }

  return cleaned;
}

export function toDisplayName(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeUnit(value: unknown): ShoppingItemUnit {
  if (typeof value !== "string") {
    return "unit";
  }

  const trimmed = value.trim();
  const comparable = cleanComparable(trimmed);
  const alias = UNIT_ALIASES[comparable];

  if (alias) {
    return alias;
  }

  if (SHOPPING_UNITS.includes(trimmed as ShoppingItemUnit)) {
    return trimmed as ShoppingItemUnit;
  }

  return "unit";
}

export function normalizeCategory(value: unknown): ShoppingItemCategory {
  if (
    typeof value === "string" &&
    SHOPPING_ITEM_CATEGORIES.includes(value as ShoppingItemCategory)
  ) {
    return value as ShoppingItemCategory;
  }

  if (value === "protein") {
    return "meat";
  }

  if (value === "snacks") {
    return "pantry";
  }

  return "other";
}

export function detectCategory(normalizedName: string): ShoppingItemCategory {
  const comparable = cleanComparable(normalizedName);

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    ShoppingItemCategory,
    string[],
  ][]) {
    if (keywords.some((keyword) => comparable.includes(cleanComparable(keyword)))) {
      return category;
    }
  }

  return "other";
}

function inferKnownDefaults(normalizedName: string): DefaultInference | null {
  const includes = (...terms: string[]) =>
    terms.some((term) => normalizedName.includes(cleanComparable(term)));

  if (includes("milk", "leite", "leche")) {
    return { quantity: 1, unit: "L", category: "dairy", confidence: "high" };
  }

  if (includes("egg", "ovo", "huevo")) {
    return { quantity: 12, unit: "unit", category: "dairy", confidence: "medium" };
  }

  if (includes("rice", "arroz")) {
    return { quantity: 1, unit: "kg", category: "pantry", confidence: "high" };
  }

  if (includes("flour", "farinha", "harina")) {
    return { quantity: 1, unit: "kg", category: "pantry", confidence: "high" };
  }

  if (includes("sugar", "acucar", "azucar")) {
    return { quantity: 1, unit: "kg", category: "pantry", confidence: "high" };
  }

  if (includes("salt", "sal")) {
    return { quantity: 1, unit: "kg", category: "pantry", confidence: "medium" };
  }

  if (includes("chicken", "frango", "pollo")) {
    return { quantity: 1, unit: "kg", category: "meat", confidence: "medium" };
  }

  if (includes("banana", "platan")) {
    return { quantity: 1, unit: "kg", category: "produce", confidence: "high" };
  }

  if (includes("bread", "pao", "pan")) {
    return { quantity: 1, unit: "unit", category: "bakery", confidence: "medium" };
  }

  if (includes("toilet paper", "papel higienico")) {
    return { quantity: 1, unit: "pack", category: "household", confidence: "medium" };
  }

  if (includes("detergent", "detergente")) {
    return { quantity: 1, unit: "bottle", category: "cleaning", confidence: "medium" };
  }

  if (includes("olive oil", "azeite", "aceite de oliva")) {
    return { quantity: 1, unit: "L", category: "pantry", confidence: "medium" };
  }

  return null;
}

export function createParsedShoppingItem(
  rawText: string,
  rawName: string,
  options: InferenceOptions = {},
): ParsedShoppingItem {
  const normalizedName = normalizeItemName(rawName);
  const knownDefaults = inferKnownDefaults(normalizedName);
  const fallbackCategory = detectCategory(normalizedName);
  const quantity = options.explicitQuantity ?? knownDefaults?.quantity ?? 1;
  const unit = options.explicitUnit
    ? normalizeUnit(options.explicitUnit)
    : knownDefaults?.unit ?? "unit";
  const category = knownDefaults?.category ?? fallbackCategory;
  const confidence = options.explicitQuantity
    ? "high"
    : knownDefaults?.confidence ?? (fallbackCategory === "other" ? "low" : "medium");
  const suggestionGroups = getItemSuggestionGroups(rawName, options.locale, {
    hasExplicitQuantity: Boolean(options.explicitQuantity),
  });

  return {
    id: crypto.randomUUID(),
    originalText: rawText.trim(),
    rawText: rawText.trim(),
    name: toDisplayName(rawName.trim()),
    normalizedName,
    quantity,
    unit,
    category,
    confidence,
    needsReview: confidence === "low" || suggestionGroups.length > 0,
    notes: null,
    suggestionGroups,
  };
}
