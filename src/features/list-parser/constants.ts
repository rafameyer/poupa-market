import {
  SHOPPING_ITEM_CATEGORIES,
  type ShoppingItemCategory,
} from "@/types/shopping-list";

export const DEFAULT_LIST_PARSER_MODEL = "gpt-4.1-mini";

export const SHOPPING_UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "pack",
  "pcs",
  "dozen",
  "bottle",
  "can",
  "box",
  "bag",
] as const;

export const CATEGORY_KEYWORDS: Record<ShoppingItemCategory, string[]> = {
  produce: [
    "apple",
    "banana",
    "lettuce",
    "tomato",
    "potato",
    "onion",
    "carrot",
    "orange",
    "broccoli",
    "spinach",
    "pepper",
    "cucumber",
  ],
  bakery: ["bread", "bagel", "bun", "croissant", "wrap", "tortilla", "cake"],
  dairy: ["milk", "cheese", "yogurt", "butter", "cream", "mozzarella"],
  protein: [
    "egg",
    "eggs",
    "chicken",
    "beef",
    "fish",
    "salmon",
    "tuna",
    "tofu",
    "ham",
    "turkey",
  ],
  pantry: [
    "rice",
    "pasta",
    "flour",
    "salt",
    "sugar",
    "beans",
    "lentil",
    "cereal",
    "oil",
    "vinegar",
    "sauce",
    "spice",
  ],
  frozen: ["frozen", "ice cream", "pizza", "fries"],
  beverages: ["water", "juice", "soda", "coffee", "tea"],
  household: ["detergent", "soap", "paper towel", "toilet paper", "trash bag"],
  "personal-care": ["shampoo", "toothpaste", "deodorant", "lotion"],
  snacks: ["chips", "cracker", "cookie", "chocolate", "nuts"],
  other: [],
};

export function getAllowedCategories() {
  return [...SHOPPING_ITEM_CATEGORIES];
}
