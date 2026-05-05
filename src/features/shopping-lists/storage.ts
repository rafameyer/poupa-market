import {
  normalizeCategory,
  normalizeItemName,
  normalizeUnit,
  toDisplayName,
} from "@/features/list-parser/inference";
import { LocalStorageAdapter } from "@/lib/storage/local-storage-adapter";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import {
  ITEM_CONFIDENCE_LEVELS,
  type ItemConfidence,
  type ItemSuggestionGroup,
  type ParsedShoppingItem,
  type ShoppingList,
  type ShoppingListDraft,
  type ShoppingListFrequency,
  type ShoppingListItem,
  type ShoppingListScope,
  type ShoppingListStatus,
} from "@/types/shopping-list";

const shoppingListsAdapter = new LocalStorageAdapter<ShoppingList>(STORAGE_KEYS.shoppingLists);
const shoppingListItemsAdapter = new LocalStorageAdapter<ShoppingListItem>(
  STORAGE_KEYS.shoppingListItems,
);

export interface ShoppingListWithItems {
  list: ShoppingList;
  items: ShoppingListItem[];
}

export interface ShoppingListUpdateInput {
  name: string;
  frequency: ShoppingListFrequency;
  marketScope: ShoppingListScope;
  radiusKm: number;
  status?: ShoppingListStatus;
  sourceText?: string;
  parseProvider?: ShoppingList["parseProvider"];
  parseWarning?: string | null;
  parsedItems: ParsedShoppingItem[];
}

function sortByUpdatedAt<T extends { updatedAt: string }>(items: T[]) {
  return [...items].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function normalizeStatus(value: unknown): ShoppingListStatus {
  if (value === "completed") {
    return "completed";
  }

  if (value === "draft") {
    return "draft";
  }

  return "active";
}

function normalizeConfidence(value: unknown): ItemConfidence {
  return typeof value === "string" &&
    ITEM_CONFIDENCE_LEVELS.includes(value as ItemConfidence)
    ? (value as ItemConfidence)
    : "low";
}

function normalizeSuggestionGroups(value: unknown): ItemSuggestionGroup[] {
  return Array.isArray(value) ? (value as ItemSuggestionGroup[]) : [];
}

function normalizeQuantity(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  return 1;
}

function normalizeShoppingList(list: ShoppingList): ShoppingList {
  const timestamp = list.updatedAt || list.createdAt || new Date().toISOString();

  return {
    ...list,
    status: normalizeStatus(list.status),
    itemCount: Number.isFinite(list.itemCount) ? list.itemCount : 0,
    radiusKm: Number.isFinite(list.radiusKm) ? list.radiusKm : 5,
    parseWarning: list.parseWarning ?? null,
    createdAt: list.createdAt || timestamp,
    updatedAt: timestamp,
  };
}

export function mapShoppingListItemToParsed(item: ShoppingListItem): ParsedShoppingItem {
  const rawText = item.rawText || item.name;
  const name = item.name?.trim() || toDisplayName(rawText);
  const confidence = normalizeConfidence(item.confidence);
  const suggestionGroups = normalizeSuggestionGroups(item.suggestionGroups);

  return {
    id: item.id,
    originalText: item.rawText || rawText,
    rawText,
    name,
    normalizedName: item.normalizedName || normalizeItemName(name),
    quantity: normalizeQuantity(item.quantity),
    unit: normalizeUnit(item.unit),
    category: normalizeCategory(item.category),
    confidence,
    needsReview:
      typeof item.needsReview === "boolean"
        ? item.needsReview
        : confidence === "low" || suggestionGroups.length > 0,
    notes: item.notes ?? null,
    suggestionGroups,
  };
}

function normalizeShoppingListItem(item: ShoppingListItem): ShoppingListItem {
  const timestamp = item.updatedAt || item.createdAt || new Date().toISOString();
  const parsedItem = mapShoppingListItemToParsed(item);

  return {
    ...item,
    rawText: parsedItem.rawText,
    name: parsedItem.name,
    normalizedName: parsedItem.normalizedName,
    quantity: parsedItem.quantity,
    unit: parsedItem.unit,
    category: parsedItem.category,
    confidence: parsedItem.confidence,
    needsReview: parsedItem.needsReview,
    notes: parsedItem.notes,
    suggestionGroups: parsedItem.suggestionGroups,
    checked: Boolean(item.checked),
    createdAt: item.createdAt || timestamp,
    updatedAt: timestamp,
  };
}

function mapParsedItemToShoppingListItem(
  shoppingListId: string,
  item: ParsedShoppingItem,
  timestamp: string,
): ShoppingListItem {
  return {
    id: item.id || crypto.randomUUID(),
    shoppingListId,
    rawText: item.rawText || item.originalText || item.name,
    name: item.name,
    normalizedName: item.normalizedName || normalizeItemName(item.name),
    quantity: normalizeQuantity(item.quantity),
    unit: normalizeUnit(item.unit),
    category: normalizeCategory(item.category),
    confidence: normalizeConfidence(item.confidence),
    needsReview: item.needsReview,
    notes: item.notes,
    suggestionGroups: normalizeSuggestionGroups(item.suggestionGroups),
    checked: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function getShoppingLists() {
  return sortByUpdatedAt((await shoppingListsAdapter.getAll()).map(normalizeShoppingList));
}

export async function getShoppingListItems() {
  return (await shoppingListItemsAdapter.getAll()).map(normalizeShoppingListItem);
}

export async function getShoppingListsWithItems(): Promise<ShoppingListWithItems[]> {
  const [lists, items] = await Promise.all([getShoppingLists(), getShoppingListItems()]);

  return sortByUpdatedAt(lists).map((list) => {
    const listItems = items.filter((item) => item.shoppingListId === list.id);

    return {
      list: {
        ...list,
        itemCount: listItems.length,
      },
      items: listItems,
    };
  });
}

export async function createShoppingListFromDraft(
  draft: ShoppingListDraft,
): Promise<ShoppingListWithItems> {
  const timestamp = new Date().toISOString();
  const shoppingListId = crypto.randomUUID();

  const list: ShoppingList = {
    id: shoppingListId,
    name: draft.name,
    frequency: draft.frequency,
    marketScope: draft.marketScope,
    radiusKm: draft.radiusKm,
    status: "active",
    sourceText: draft.sourceText,
    itemCount: draft.parsedItems.length,
    parseProvider: draft.parseProvider,
    parseWarning: draft.parseWarning,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const items = draft.parsedItems.map((item) =>
    mapParsedItemToShoppingListItem(shoppingListId, item, timestamp),
  );

  await shoppingListsAdapter.create(list);
  await Promise.all(items.map((item) => shoppingListItemsAdapter.create(item)));

  return {
    list,
    items,
  };
}

export async function updateShoppingListWithItems(
  listId: string,
  updates: ShoppingListUpdateInput,
): Promise<ShoppingListWithItems> {
  const existingList = await shoppingListsAdapter.getById(listId);

  if (!existingList) {
    throw new Error(`Shopping list with id "${listId}" was not found.`);
  }

  const timestamp = new Date().toISOString();
  const items = updates.parsedItems.map((item) =>
    mapParsedItemToShoppingListItem(listId, item, timestamp),
  );

  const updatedList = await shoppingListsAdapter.update(listId, {
    name: updates.name,
    frequency: updates.frequency,
    marketScope: updates.marketScope,
    radiusKm: updates.radiusKm,
    status: updates.status ?? normalizeStatus(existingList.status),
    sourceText: updates.sourceText ?? existingList.sourceText,
    itemCount: items.length,
    parseProvider: updates.parseProvider ?? existingList.parseProvider,
    parseWarning:
      typeof updates.parseWarning === "undefined"
        ? existingList.parseWarning
        : updates.parseWarning,
    updatedAt: timestamp,
  });

  const existingItems = await shoppingListItemsAdapter.getAll();
  const listItemIds = existingItems
    .filter((item) => item.shoppingListId === listId)
    .map((item) => item.id);

  await Promise.all(listItemIds.map((itemId) => shoppingListItemsAdapter.delete(itemId)));
  await Promise.all(items.map((item) => shoppingListItemsAdapter.create(item)));

  return {
    list: normalizeShoppingList(updatedList),
    items,
  };
}
