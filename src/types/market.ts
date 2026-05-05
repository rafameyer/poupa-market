export interface Market {
  id: string;
  placeId?: string;
  name: string;
  address?: string;
  distanceKm?: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NearbyMarket {
  placeId: string;
  name: string;
  address: string;
  distanceKm: number | null;
  rating: number | null;
  userRatingCount: number | null;
  openNow: boolean | null;
  businessStatus: string | null;
  googleMapsUri: string | null;
  location: Coordinates | null;
}

export interface FavoriteMarket {
  placeId: string;
  name: string;
  address?: string;
  googleMapsUri?: string | null;
  rating?: number | null;
  lastSeenAt: string;
}

export interface SavedLocation extends Coordinates {
  label: string;
  source: "browser" | "manual";
  updatedAt: string;
}
