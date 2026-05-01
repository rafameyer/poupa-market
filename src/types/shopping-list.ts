export type ShoppingListFrequency = "weekly" | "biweekly" | "monthly";

export interface ShoppingList {
  id: string;
  name: string;
  frequency: ShoppingListFrequency;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  shoppingListId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
