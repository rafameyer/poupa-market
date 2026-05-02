import { LocalStorageAdapter } from "@/lib/storage/local-storage-adapter";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type {
  ParsedShoppingItem,
  ShoppingList,
  ShoppingListDraft,
  ShoppingListItem,
  ShoppingListStatus,
} from "@/types/shopping-list";

const shoppingListsAdapter = new LocalStorageAdapter<ShoppingList>(STORAGE_KEYS.shoppingLists);
const shoppingListItemsAdapter = new LocalStorageAdapter<ShoppingListItem>(
  STORAGE_KEYS.shoppingListItems,
);

export interface ShoppingListWithItems {
  list: ShoppingList;
  items: ShoppingListItem[];
}

function sortByUpdatedAt<T extends { updatedAt: string }>(items: T[]) {
  return [...items].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function mapParsedItemToShoppingListItem(
  shoppingListId: string,
  item: ParsedShoppingItem,
  timestamp: string,
): ShoppingListItem {
  return {
    id: crypto.randomUUID(),
    shoppingListId,
    rawText: item.rawText,
    name: item.name,
    normalizedName: item.normalizedName,
    quantity: item.quantity,
    unit: item.unit,
    category: item.category,
    notes: item.notes,
    checked: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function getShoppingLists() {
  return sortByUpdatedAt(await shoppingListsAdapter.getAll());
}

export async function getShoppingListItems() {
  return await shoppingListItemsAdapter.getAll();
}

export async function getShoppingListsWithItems(): Promise<ShoppingListWithItems[]> {
  const [lists, items] = await Promise.all([
    shoppingListsAdapter.getAll(),
    shoppingListItemsAdapter.getAll(),
  ]);

  return sortByUpdatedAt(lists).map((list) => ({
    list,
    items: items.filter((item) => item.shoppingListId === list.id),
  }));
}

export async function createShoppingListFromDraft(
  draft: ShoppingListDraft,
): Promise<ShoppingListWithItems> {
  const timestamp = new Date().toISOString();
  const shoppingListId = crypto.randomUUID();
  const status: ShoppingListStatus = "pending";

  const list: ShoppingList = {
    id: shoppingListId,
    name: draft.name,
    frequency: draft.frequency,
    marketScope: draft.marketScope,
    radiusKm: draft.radiusKm,
    status,
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
