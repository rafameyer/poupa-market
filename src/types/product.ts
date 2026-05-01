export type ProductUnit = "unit" | "kg" | "g" | "l" | "ml" | "pack";

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: ProductUnit;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}
