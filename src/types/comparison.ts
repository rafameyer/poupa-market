export interface MarketComparisonTotal {
  marketId: string;
  total: number;
  missingProductIds: string[];
}

export interface ComparisonResult {
  shoppingListId: string;
  totalsByMarket: MarketComparisonTotal[];
  cheapestMarketId?: string;
  estimatedSavings?: number;
  calculatedAt: string;
}
