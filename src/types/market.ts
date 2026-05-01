export interface Market {
  id: string;
  name: string;
  address?: string;
  distanceKm?: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
