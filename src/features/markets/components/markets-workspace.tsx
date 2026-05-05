"use client";

import {
  AlertTriangle,
  ExternalLink,
  Heart,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Radar,
  Search,
  Star,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { useAppPreferences } from "@/features/preferences/provider";
import { cn } from "@/lib/utils";
import type { FavoriteMarket, NearbyMarket, SavedLocation } from "@/types/market";

const RADIUS_OPTIONS = [1, 5, 10, 20];

type MarketSearchStatus =
  | "idle"
  | "locating"
  | "searching"
  | "permission-denied"
  | "success"
  | "error";

interface NearbyMarketsResponse {
  ok: boolean;
  markets?: NearbyMarket[];
  code?: string;
  error?: string;
}

interface GeocodeResponse {
  ok: boolean;
  location?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  code?: string;
  error?: string;
}

function favoriteFromMarket(market: NearbyMarket): FavoriteMarket {
  return {
    placeId: market.placeId,
    name: market.name,
    address: market.address,
    googleMapsUri: market.googleMapsUri,
    rating: market.rating,
    lastSeenAt: new Date().toISOString(),
  };
}

export function MarketsWorkspace() {
  const { locale, messages, preferences, updatePreferences } = useAppPreferences();
  const [markets, setMarkets] = useState<NearbyMarket[]>([]);
  const [status, setStatus] = useState<MarketSearchStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState("");
  const [customRadius, setCustomRadius] = useState("");

  const favoritePlaceIds = new Set(preferences.favoriteMarkets.map((market) => market.placeId));
  const isLoading = status === "locating" || status === "searching";

  function mapApiError(code?: string, fallback?: string) {
    switch (code) {
      case "missing_api_key":
        return messages.markets.apiKeyMissing;
      case "invalid_radius":
        return messages.markets.invalidRadius;
      case "location_not_found":
        return messages.markets.locationNotFound;
      case "unauthenticated":
        return messages.markets.signInRequired;
      default:
        return fallback || messages.markets.searchFailed;
    }
  }

  async function searchNearbyMarkets(location: SavedLocation, radiusKm = preferences.radiusKm) {
    setStatus("searching");
    setStatusMessage(null);
    setMarkets([]);

    try {
      const response = await fetch("/api/places/nearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          radiusKm,
          locale,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as NearbyMarketsResponse;

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setStatusMessage(mapApiError(payload.code, payload.error));
        return;
      }

      const nextMarkets = payload.markets ?? [];
      setMarkets(nextMarkets);
      setStatus("success");
      setStatusMessage(nextMarkets.length > 0 ? null : messages.markets.noMarketsFound);
      updatePreferences({
        radiusKm,
        locationLabel: location.label,
        lastKnownLocation: location,
      });
    } catch {
      setStatus("error");
      setStatusMessage(messages.markets.searchFailed);
    }
  }

  function requestBrowserLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setStatusMessage(messages.markets.locationUnsupported);
      return;
    }

    setStatus("locating");
    setStatusMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: SavedLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: messages.markets.currentLocation,
          source: "browser",
          updatedAt: new Date().toISOString(),
        };

        void searchNearbyMarkets(location);
      },
      () => {
        setMarkets([]);
        setStatus("permission-denied");
        setStatusMessage(messages.markets.permissionDeniedBody);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 12 * 1000,
      },
    );
  }

  async function searchManualLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = manualQuery.trim();

    if (query.length < 2) {
      setStatus("error");
      setStatusMessage(messages.markets.manualLocationRequired);
      return;
    }

    setStatus("searching");
    setStatusMessage(null);

    try {
      const response = await fetch("/api/places/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          locale,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as GeocodeResponse;

      if (!response.ok || !payload.ok || !payload.location) {
        setStatus("error");
        setStatusMessage(mapApiError(payload.code, payload.error));
        return;
      }

      const location: SavedLocation = {
        ...payload.location,
        source: "manual",
        updatedAt: new Date().toISOString(),
      };

      setManualQuery("");
      await searchNearbyMarkets(location);
    } catch {
      setStatus("error");
      setStatusMessage(messages.markets.searchFailed);
    }
  }

  function updateRadius(radiusKm: number) {
    updatePreferences({ radiusKm });

    if (preferences.lastKnownLocation) {
      void searchNearbyMarkets(preferences.lastKnownLocation, radiusKm);
    }
  }

  function submitCustomRadius(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRadius = Number(customRadius);

    if (!Number.isFinite(nextRadius) || nextRadius <= 0 || nextRadius > 50) {
      setStatus("error");
      setStatusMessage(messages.markets.invalidRadius);
      return;
    }

    setCustomRadius("");
    updateRadius(nextRadius);
  }

  function toggleFavorite(market: NearbyMarket) {
    updatePreferences((current) => {
      const exists = current.favoriteMarkets.some((favorite) => favorite.placeId === market.placeId);
      const favoriteMarkets = exists
        ? current.favoriteMarkets.filter((favorite) => favorite.placeId !== market.placeId)
        : [...current.favoriteMarkets, favoriteFromMarket(market)];

      return {
        ...current,
        marketScope: favoriteMarkets.length > 0 ? "favorites" : "nearby",
        favoriteMarkets,
      };
    });
  }

  function removeFavorite(placeId: string) {
    updatePreferences((current) => {
      const favoriteMarkets = current.favoriteMarkets.filter((market) => market.placeId !== placeId);

      return {
        ...current,
        marketScope: favoriteMarkets.length > 0 ? "favorites" : "nearby",
        favoriteMarkets,
      };
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          <MapPin className="mr-1 size-3.5" />
          {preferences.locationLabel || messages.settings.currentArea}
        </Badge>
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          <Radar className="mr-1 size-3.5" />
          {preferences.radiusKm} {messages.common.kilometers}
        </Badge>
      </div>

      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="gap-3">
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.markets.locationSearch}
          </Badge>
          <div className="space-y-2">
            <CardTitle>{messages.markets.findMarkets}</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              {messages.markets.findMarketsSubtitle}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Button
              className="h-12 justify-start px-4 sm:justify-center"
              disabled={isLoading}
              onClick={requestBrowserLocation}
              type="button"
            >
              {status === "locating" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LocateFixed className="size-4" />
              )}
              {messages.markets.useCurrentLocation}
            </Button>
            {preferences.lastKnownLocation ? (
              <Button
                className="h-12 px-4"
                disabled={isLoading}
                onClick={() => void searchNearbyMarkets(preferences.lastKnownLocation!)}
                type="button"
                variant="outline"
              >
                <Search className="size-4" />
                {messages.markets.searchAgain}
              </Button>
            ) : null}
          </div>

          <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={searchManualLocation}>
            <Input
              className="h-12 rounded-[1.2rem] bg-card px-4"
              disabled={isLoading}
              onChange={(event) => setManualQuery(event.target.value)}
              placeholder={messages.markets.manualLocationPlaceholder}
              type="text"
              value={manualQuery}
            />
            <Button className="h-12 px-5" disabled={isLoading} type="submit" variant="outline">
              <Search className="size-4" />
              {messages.markets.searchArea}
            </Button>
          </form>

          <div className="space-y-3 rounded-[1.35rem] border border-border bg-background/70 p-3">
            <p className="text-sm font-medium text-foreground">{messages.markets.radius}</p>
            <div className="flex flex-wrap gap-2">
              {RADIUS_OPTIONS.map((radiusKm) => (
                <Button
                  className={cn("h-10 px-4", preferences.radiusKm === radiusKm && "border-primary bg-primary/10 text-primary")}
                  disabled={isLoading}
                  key={radiusKm}
                  onClick={() => updateRadius(radiusKm)}
                  type="button"
                  variant="outline"
                >
                  {radiusKm} {messages.common.kilometers}
                </Button>
              ))}
            </div>
            <form className="grid gap-2 sm:grid-cols-[1fr_auto]" onSubmit={submitCustomRadius}>
              <Input
                className="h-11 rounded-[1.1rem] bg-card px-4"
                disabled={isLoading}
                inputMode="decimal"
                max={50}
                min={1}
                onChange={(event) => setCustomRadius(event.target.value)}
                placeholder={messages.markets.customRadiusPlaceholder}
                type="number"
                value={customRadius}
              />
              <Button className="h-11 px-4" disabled={isLoading} type="submit" variant="secondary">
                {messages.markets.applyRadius}
              </Button>
            </form>
          </div>

          {statusMessage ? (
            <div
              className={cn(
                "flex gap-3 rounded-[1.35rem] border px-4 py-4 text-sm leading-6",
                status === "permission-denied" || status === "error"
                  ? "border-amber-200 bg-amber-50 text-amber-950"
                  : "border-border bg-secondary text-muted-foreground",
              )}
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.markets.favorites}
          </Badge>
          <CardTitle>{messages.markets.favorites}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {preferences.favoriteMarkets.length > 0 ? (
            preferences.favoriteMarkets.map((market) => (
              <div className="rounded-[1.35rem] bg-secondary px-4 py-4" key={market.placeId}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{market.name}</p>
                    {market.address ? (
                      <p className="text-sm leading-5 text-muted-foreground">{market.address}</p>
                    ) : null}
                  </div>
                  <Button
                    className="h-10 px-4"
                    onClick={() => removeFavorite(market.placeId)}
                    type="button"
                    variant="ghost"
                  >
                    <Heart className="size-4 fill-current text-primary" />
                    {messages.markets.saved}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.35rem] bg-secondary px-4 py-4 text-sm text-muted-foreground">
              {messages.markets.addFavorites}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.markets.nearby}
          </Badge>
          <CardTitle>{messages.markets.nearby}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div className="animate-pulse rounded-[1.35rem] border border-border bg-card px-4 py-5" key={index}>
                <div className="h-4 w-2/3 rounded-full bg-secondary" />
                <div className="mt-3 h-3 w-full rounded-full bg-secondary" />
                <div className="mt-4 h-9 w-32 rounded-full bg-secondary" />
              </div>
            ))
          ) : null}

          {!isLoading && markets.length === 0 ? (
            <div className="rounded-[1.35rem] border border-dashed border-border bg-card px-4 py-5 text-sm leading-6 text-muted-foreground">
              {status === "success"
                ? messages.markets.noMarketsSubtitle
                : messages.markets.startSearchHint}
            </div>
          ) : null}

          {!isLoading
            ? markets.map((market) => {
                const isFavorite = favoritePlaceIds.has(market.placeId);

                return (
                  <div className="rounded-[1.35rem] border border-border bg-card px-4 py-4" key={market.placeId}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-3">
                        <div>
                          <p className="font-semibold text-foreground">{market.name}</p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">{market.address}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {market.distanceKm !== null ? (
                            <Badge className="rounded-full px-3 py-1" variant="secondary">
                              <MapPin className="mr-1 size-3.5" />
                              {market.distanceKm} {messages.common.kilometers}
                            </Badge>
                          ) : null}
                          {market.rating !== null ? (
                            <Badge className="rounded-full px-3 py-1" variant="secondary">
                              <Star className="mr-1 size-3.5 fill-current" />
                              {market.rating}
                              {market.userRatingCount ? ` (${market.userRatingCount})` : ""}
                            </Badge>
                          ) : null}
                          <Badge className="rounded-full px-3 py-1" variant="secondary">
                            {market.openNow === true
                              ? messages.markets.openNow
                              : market.openNow === false
                                ? messages.markets.closedNow
                                : messages.markets.openingUnknown}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        aria-label={isFavorite ? messages.markets.removeFavorite : messages.markets.saveFavorite}
                        className="h-10 px-4"
                        onClick={() => toggleFavorite(market)}
                        type="button"
                        variant={isFavorite ? "secondary" : "outline"}
                      >
                        <Heart className={isFavorite ? "size-4 fill-current" : "size-4"} />
                        {isFavorite ? messages.markets.saved : messages.markets.notSaved}
                      </Button>
                    </div>
                    {market.googleMapsUri ? (
                      <Button asChild className="mt-4 h-9 px-0" variant="link">
                        <a href={market.googleMapsUri} rel="noreferrer" target="_blank">
                          {messages.markets.openInMaps}
                          <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                );
              })
            : null}
        </CardContent>
      </Card>
    </div>
  );
}
