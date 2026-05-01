export interface PriceEntry {
  id: string;
  productId: string;
  marketId: string;
  price: number;
  observedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
