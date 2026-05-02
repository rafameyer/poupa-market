"use client";

import { Globe, Heart, MapPin, Plus, Radar } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { useAppMessages, useAppPreferences } from "@/features/preferences/provider";

const MARKET_NAMES = ["Lidl", "Pingo Doce", "Continente", "Auchan", "Aldi"];

export function SettingsWorkspace() {
  const messages = useAppMessages();
  const { locale, preferences, updatePreferences } = useAppPreferences();
  const [familyEmail, setFamilyEmail] = useState("");
  const [familyId, setFamilyId] = useState("");

  const languageLabel = useMemo(() => {
    switch (locale) {
      case "pt":
        return messages.common.portuguese;
      case "es":
        return messages.common.spanish;
      default:
        return messages.common.english;
    }
  }, [locale, messages.common.english, messages.common.portuguese, messages.common.spanish]);

  return (
    <div className="grid gap-4">
      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.settings.language}
          </Badge>
          <CardTitle>{messages.settings.language}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[1.35rem] bg-secondary px-4 py-4 text-sm">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Globe className="size-4 text-primary" />
              {languageLabel}
            </div>
          </div>
          <ToggleGroup
            className="flex flex-wrap gap-2"
            onValueChange={(value) =>
              updatePreferences({
                manualLanguage:
                  value === "system" ? null : (value as "en" | "pt" | "es"),
              })
            }
            type="single"
            value={preferences.manualLanguage ?? "system"}
          >
            <ToggleGroupItem className="rounded-full px-4" value="system">
              {messages.common.system}
            </ToggleGroupItem>
            <ToggleGroupItem className="rounded-full px-4" value="en">
              {messages.common.english}
            </ToggleGroupItem>
            <ToggleGroupItem className="rounded-full px-4" value="pt">
              {messages.common.portuguese}
            </ToggleGroupItem>
            <ToggleGroupItem className="rounded-full px-4" value="es">
              {messages.common.spanish}
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.settings.location}
          </Badge>
          <CardTitle>{messages.settings.location}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="location-label">
              {messages.settings.currentArea}
            </label>
            <Input
              className="h-12 rounded-[1.2rem] bg-card px-4"
              id="location-label"
              onChange={(event) =>
                updatePreferences({
                  locationLabel: event.target.value.trim() || null,
                })
              }
              placeholder={messages.settings.locationPlaceholder}
              type="text"
              value={preferences.locationLabel ?? ""}
            />
          </div>
          <div className="rounded-[1.35rem] bg-secondary px-4 py-4 text-sm">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <MapPin className="size-4 text-primary" />
              {preferences.locationLabel || messages.settings.locationPlaceholder}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{messages.settings.savedRadius}</p>
            <ToggleGroup
              className="flex flex-wrap gap-2"
              onValueChange={(value) =>
                value && updatePreferences({ radiusKm: Number(value) })
              }
              type="single"
              value={String(preferences.radiusKm)}
            >
              {["1", "5", "10", "20"].map((value) => (
                <ToggleGroupItem className="rounded-full px-4" key={value} value={value}>
                  <Radar className="size-3.5" />
                  {value} {messages.common.kilometers}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.settings.markets}
          </Badge>
          <CardTitle>{messages.settings.favoriteMarkets}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {MARKET_NAMES.map((market) => {
            const isFavorite = preferences.favoriteMarkets.includes(market);

            return (
              <Button
                className="h-10 px-4"
                key={market}
                onClick={() =>
                  updatePreferences((current) => {
                    const favoriteMarkets = isFavorite
                      ? current.favoriteMarkets.filter((entry) => entry !== market)
                      : [...current.favoriteMarkets, market];

                    return {
                      ...current,
                      marketScope:
                        favoriteMarkets.length > 0 ? "favorites" : "nearby",
                      favoriteMarkets,
                    };
                  })
                }
                type="button"
                variant={isFavorite ? "secondary" : "outline"}
              >
                <Heart className={isFavorite ? "size-3.5 fill-current" : "size-3.5"} />
                {market}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.settings.family}
          </Badge>
          <CardTitle>{messages.settings.family}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              className="h-12 rounded-[1.2rem] bg-card px-4"
              onChange={(event) => setFamilyEmail(event.target.value)}
              placeholder={messages.settings.familyEmail}
              type="email"
              value={familyEmail}
            />
            <Input
              className="h-12 rounded-[1.2rem] bg-card px-4"
              onChange={(event) => setFamilyId(event.target.value)}
              placeholder={messages.settings.familyId}
              type="text"
              value={familyId}
            />
          </div>
          <Button className="h-12 w-full sm:w-auto" size="lg" type="button" variant="outline">
            <Plus className="size-4" />
            {messages.settings.addFamily}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
