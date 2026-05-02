"use client";

import { Heart, MapPin, Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useAppMessages, useAppPreferences } from "@/features/preferences/provider";

const MARKET_NAMES = ["Lidl", "Pingo Doce", "Continente", "Auchan", "Aldi"];

export function MarketsWorkspace() {
  const messages = useAppMessages();
  const { preferences, updatePreferences } = useAppPreferences();

  function toggleFavorite(market: string) {
    updatePreferences((current) => {
      const exists = current.favoriteMarkets.includes(market);
      const favoriteMarkets = exists
        ? current.favoriteMarkets.filter((item) => item !== market)
        : [...current.favoriteMarkets, market];

      return {
        ...current,
        favoriteMarkets,
      };
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          {preferences.locationLabel || messages.settings.currentArea}
        </Badge>
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          {preferences.radiusKm} {messages.common.kilometers}
        </Badge>
      </div>

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
              <div className="flex items-center justify-between rounded-[1.35rem] bg-secondary px-4 py-4" key={market}>
                <div>
                  <p className="font-semibold text-foreground">{market}</p>
                  <p className="text-sm text-muted-foreground">{messages.markets.inRange}</p>
                </div>
                <Button
                  className="h-10 px-4"
                  onClick={() => toggleFavorite(market)}
                  type="button"
                  variant="ghost"
                >
                  <Heart className="size-4 fill-current text-primary" />
                  {messages.markets.saved}
                </Button>
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
          {MARKET_NAMES.map((market) => {
            const isFavorite = preferences.favoriteMarkets.includes(market);

            return (
              <div className="rounded-[1.35rem] border border-border bg-card px-4 py-4" key={market}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">{market}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="rounded-full px-3 py-1" variant="secondary">
                        <MapPin className="mr-1 size-3.5" />
                        {preferences.radiusKm} {messages.common.kilometers}
                      </Badge>
                      <Badge className="rounded-full px-3 py-1" variant="secondary">
                        <Route className="mr-1 size-3.5" />
                        {messages.markets.routePreview}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    className="h-10 px-4"
                    onClick={() => toggleFavorite(market)}
                    type="button"
                    variant={isFavorite ? "secondary" : "outline"}
                  >
                    <Heart className={isFavorite ? "size-4 fill-current" : "size-4"} />
                    {isFavorite ? messages.markets.saved : messages.markets.notSaved}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
