import type { AppLocale } from "@/lib/i18n/config";
import type {
  ItemSuggestionGroup,
  ItemSuggestionOption,
  ShoppingItemCategory,
  ShoppingItemUnit,
} from "@/types/shopping-list";

interface SuggestionOptions {
  hasExplicitQuantity?: boolean;
}

const SUGGESTION_PRIORITY = {
  clarification: 0,
  quantity: 1,
  unit: 2,
} as const;

function cleanComparable(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasTerm(value: string, terms: string[]) {
  const comparable = cleanComparable(value);
  return terms.some((term) => comparable.includes(cleanComparable(term)));
}

function label(
  locale: AppLocale | undefined,
  labels: Record<AppLocale, string>,
) {
  return labels[locale ?? "en"];
}

function option({
  id,
  label: optionLabel,
  value,
  name,
  normalizedName,
  quantity,
  unit,
  category,
  needsReview,
}: {
  id: string;
  label: string;
  value?: string;
  name?: string;
  normalizedName?: string;
  quantity?: number;
  unit?: ShoppingItemUnit;
  category?: ShoppingItemCategory;
  needsReview?: boolean;
}): ItemSuggestionOption {
  return {
    id,
    label: optionLabel,
    value: value ?? optionLabel,
    updates: {
      ...(name ? { name } : {}),
      ...(normalizedName ? { normalizedName } : {}),
      ...(typeof quantity === "number" ? { quantity } : {}),
      ...(unit ? { unit } : {}),
      ...(category ? { category } : {}),
      ...(typeof needsReview === "boolean" ? { needsReview } : {}),
      confidence: "high",
    },
  };
}

function clarificationGroup(
  id: string,
  options: ItemSuggestionOption[],
): ItemSuggestionGroup {
  return {
    id,
    type: "clarification",
    promptKey: "whichOne",
    options,
  };
}

function quantityGroup(id: string, options: ItemSuggestionOption[]): ItemSuggestionGroup {
  return {
    id,
    type: "quantity",
    promptKey: "howMany",
    options,
  };
}

export function sortSuggestionGroups(groups: ItemSuggestionGroup[]) {
  return [...groups].sort(
    (left, right) => SUGGESTION_PRIORITY[left.type] - SUGGESTION_PRIORITY[right.type],
  );
}

export function getItemSuggestionGroups(
  itemName: string,
  locale?: AppLocale,
  options: SuggestionOptions = {},
): ItemSuggestionGroup[] {
  const groups: ItemSuggestionGroup[] = [];

  if (hasTerm(itemName, ["bacon"])) {
    groups.push(
      clarificationGroup("bacon-style", [
        option({
          id: "bacon-sliced",
          label: label(locale, { en: "Sliced", pt: "Fatiado", es: "Lonchas" }),
          name: label(locale, {
            en: "Sliced bacon",
            pt: "Bacon fatiado",
            es: "Bacon en lonchas",
          }),
          normalizedName: "sliced bacon",
          unit: "pack",
          category: "meat",
          needsReview: true,
        }),
        option({
          id: "bacon-cubes",
          label: label(locale, { en: "Cubes", pt: "Cubos", es: "Cubos" }),
          name: label(locale, {
            en: "Bacon cubes",
            pt: "Bacon em cubos",
            es: "Bacon en cubos",
          }),
          normalizedName: "bacon cubes",
          unit: "g",
          category: "meat",
          needsReview: true,
        }),
        option({
          id: "bacon-piece",
          label: label(locale, {
            en: "Whole piece",
            pt: "Peça",
            es: "Pieza",
          }),
          name: label(locale, {
            en: "Bacon piece",
            pt: "Peça de bacon",
            es: "Pieza de bacon",
          }),
          normalizedName: "bacon piece",
          unit: "g",
          category: "meat",
          needsReview: true,
        }),
      ]),
    );

    if (!options.hasExplicitQuantity) {
      groups.push(
        quantityGroup("bacon-quantity", [
          option({ id: "bacon-100", label: "100 g", quantity: 100, unit: "g" }),
          option({ id: "bacon-200", label: "200 g", quantity: 200, unit: "g" }),
          option({ id: "bacon-500", label: "500 g", quantity: 500, unit: "g" }),
        ]),
      );
    }
  }

  if (hasTerm(itemName, ["tomato", "tomate"])) {
    groups.push(
      clarificationGroup("tomato-style", [
        option({ id: "tomato-kg", label: "kg", quantity: 1, unit: "kg", category: "produce" }),
        option({
          id: "tomato-unit",
          label: label(locale, { en: "Unit", pt: "Unidade", es: "Unidad" }),
          quantity: 1,
          unit: "unit",
          category: "produce",
        }),
        option({
          id: "tomato-tray",
          label: label(locale, { en: "Tray", pt: "Bandeja", es: "Bandeja" }),
          quantity: 1,
          unit: "pack",
          category: "produce",
        }),
      ]),
    );
  }

  if (hasTerm(itemName, ["cheese", "queijo", "queso"])) {
    groups.push(
      clarificationGroup("cheese-style", [
        option({
          id: "cheese-sliced",
          label: label(locale, { en: "Sliced", pt: "Fatiado", es: "Lonchas" }),
          normalizedName: "sliced cheese",
          unit: "pack",
          category: "dairy",
        }),
        option({
          id: "cheese-block",
          label: label(locale, { en: "Block", pt: "Peça", es: "Bloque" }),
          normalizedName: "cheese block",
          unit: "kg",
          category: "dairy",
        }),
        option({
          id: "cheese-grated",
          label: label(locale, { en: "Grated", pt: "Ralado", es: "Rallado" }),
          normalizedName: "grated cheese",
          unit: "pack",
          category: "dairy",
        }),
      ]),
    );
  }

  if (hasTerm(itemName, ["chicken", "frango", "pollo"])) {
    groups.push(
      clarificationGroup("chicken-style", [
        option({
          id: "chicken-breast",
          label: label(locale, { en: "Breast", pt: "Peito", es: "Pechuga" }),
          normalizedName: "chicken breast",
          unit: "kg",
          category: "meat",
        }),
        option({
          id: "chicken-whole",
          label: label(locale, { en: "Whole", pt: "Inteiro", es: "Entero" }),
          normalizedName: "whole chicken",
          unit: "kg",
          category: "meat",
        }),
        option({
          id: "chicken-thighs",
          label: label(locale, { en: "Thighs", pt: "Coxas", es: "Muslos" }),
          normalizedName: "chicken thighs",
          unit: "kg",
          category: "meat",
        }),
      ]),
    );
  }

  if (hasTerm(itemName, ["bread", "pao", "pão", "pan"])) {
    groups.push(
      clarificationGroup("bread-style", [
        option({
          id: "bread-loaf",
          label: label(locale, { en: "Loaf", pt: "Pão inteiro", es: "Barra" }),
          normalizedName: "bread loaf",
          unit: "unit",
          category: "bakery",
        }),
        option({
          id: "bread-sliced",
          label: label(locale, { en: "Sliced", pt: "Fatiado", es: "Rebanado" }),
          normalizedName: "sliced bread",
          unit: "pack",
          category: "bakery",
        }),
        option({
          id: "bread-buns",
          label: label(locale, { en: "Buns", pt: "Pães", es: "Panecillos" }),
          normalizedName: "bread buns",
          unit: "pack",
          category: "bakery",
        }),
      ]),
    );
  }

  if (hasTerm(itemName, ["yogurt", "iogurte", "yogur"])) {
    groups.push(
      clarificationGroup("yogurt-style", [
        option({
          id: "yogurt-unit",
          label: label(locale, { en: "Unit", pt: "Unidade", es: "Unidad" }),
          quantity: 1,
          unit: "unit",
          category: "dairy",
        }),
        option({
          id: "yogurt-pack",
          label: label(locale, { en: "Pack", pt: "Pacote", es: "Paquete" }),
          quantity: 1,
          unit: "pack",
          category: "dairy",
        }),
        option({
          id: "yogurt-greek",
          label: label(locale, { en: "Greek", pt: "Grego", es: "Griego" }),
          normalizedName: "greek yogurt",
          unit: "unit",
          category: "dairy",
        }),
      ]),
    );

    if (!options.hasExplicitQuantity) {
      groups.push(
        quantityGroup("yogurt-quantity", [
          option({ id: "yogurt-1", label: "1", quantity: 1, unit: "unit" }),
          option({ id: "yogurt-4", label: "4", quantity: 4, unit: "unit" }),
          option({ id: "yogurt-6", label: "6", quantity: 6, unit: "unit" }),
        ]),
      );
    }
  }

  if (!options.hasExplicitQuantity && hasTerm(itemName, ["egg", "ovo", "huevo"])) {
    groups.push(
      quantityGroup("eggs-quantity", [
        option({ id: "eggs-6", label: "6", quantity: 6, unit: "unit", category: "dairy" }),
        option({ id: "eggs-12", label: "12", quantity: 12, unit: "unit", category: "dairy" }),
        option({ id: "eggs-24", label: "24", quantity: 24, unit: "unit", category: "dairy" }),
      ]),
    );
  }

  if (!options.hasExplicitQuantity && hasTerm(itemName, ["toilet paper", "papel higienico"])) {
    groups.push(
      quantityGroup("toilet-paper-quantity", [
        option({ id: "toilet-paper-4", label: "4", quantity: 4, unit: "unit" }),
        option({ id: "toilet-paper-8", label: "8", quantity: 8, unit: "unit" }),
        option({ id: "toilet-paper-12", label: "12", quantity: 12, unit: "unit" }),
      ]),
    );
  }

  if (!options.hasExplicitQuantity && hasTerm(itemName, ["water bottle", "garrafa de agua", "botella de agua"])) {
    groups.push(
      quantityGroup("water-bottles-quantity", [
        option({ id: "water-bottles-6", label: "6", quantity: 6, unit: "bottle" }),
        option({ id: "water-bottles-12", label: "12", quantity: 12, unit: "bottle" }),
        option({ id: "water-bottles-24", label: "24", quantity: 24, unit: "bottle" }),
      ]),
    );
  }

  return sortSuggestionGroups(groups);
}
