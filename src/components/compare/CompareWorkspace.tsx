"use client";

import { ArrowRight, MapPin, Store, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getShoppingListsWithItems, type ShoppingListWithItems } from "@/features/shopping-lists/storage";
import { APP_ROUTES } from "@/constants/app";
import { Badge } from "@/components/ui/badge";
import { useAppMessages, useAppPreferences } from "@/features/preferences/provider";

export function CompareWorkspace() {
  const searchParams = useSearchParams();
  const messages = useAppMessages();
  const { preferences } = useAppPreferences();
  const [shoppingLists, setShoppingLists] = useState<ShoppingListWithItems[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>("");

  useEffect(() => {
    async function loadLists() {
      setIsHydrated(false);
      const storedLists = await getShoppingListsWithItems();
      const requestedListId = searchParams.get("listId");
      const nextSelectedListId =
        storedLists.find((entry) => entry.list.id === requestedListId)?.list.id ??
        storedLists[0]?.list.id ??
        "";

      setShoppingLists(storedLists);
      setSelectedListId(nextSelectedListId);
      setIsHydrated(true);
    }

    void loadLists();
  }, [searchParams]);

  const selectedList =
    shoppingLists.find((entry) => entry.list.id === selectedListId) ?? null;

  const bestMarket = useMemo(
    () => preferences.favoriteMarkets[0]?.name ?? messages.common.nearby,
    [messages.common.nearby, preferences.favoriteMarkets],
  );

  return (
    <div className="space-y-6">
      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.compare.chooseList}
          </Badge>
          <CardTitle>{messages.compare.chooseList}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isHydrated ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-24 w-full rounded-[1.35rem] md:col-span-2" />
            </div>
          ) : shoppingLists.length > 0 ? (
            <>
              <ToggleGroup
                className="flex flex-wrap gap-2"
                onValueChange={(value) => value && setSelectedListId(value)}
                type="single"
                value={selectedListId}
              >
                {shoppingLists.map((entry) => (
                  <ToggleGroupItem
                    className="rounded-full px-4"
                    key={entry.list.id}
                    value={entry.list.id}
                  >
                    {entry.list.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              {selectedList ? (
                <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full px-3 py-1" variant="secondary">
                      {selectedList.items.length} {messages.lists.items}
                    </Badge>
                    <Badge className="rounded-full px-3 py-1" variant="secondary">
                      {selectedList.list.radiusKm} {messages.common.kilometers}
                    </Badge>
                    <Badge className="rounded-full px-3 py-1" variant="secondary">
                      {selectedList.list.marketScope === "favorites"
                        ? messages.common.favorites
                        : messages.common.nearby}
                    </Badge>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              description={messages.compare.noListsSubtitle}
              title={messages.compare.noLists}
            >
              <Button asChild variant="outline">
                <Link href={APP_ROUTES.lists}>{messages.common.createList}</Link>
              </Button>
            </EmptyState>
          )}
        </CardContent>
      </Card>

      {selectedList ? (
        <>
          <Card className="gap-5 bg-[linear-gradient(135deg,#1f8a5b_0%,#23796c_40%,#2c8a74_100%)] text-white ring-0">
            <CardHeader>
              <Badge className="w-fit rounded-full border-white/15 bg-white/12 px-3 py-1 text-white" variant="outline">
                {messages.compare.title}
              </Badge>
              <CardTitle className="text-[1.8rem] text-white">{bestMarket}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.25rem] bg-white/12 px-4 py-4">
                <p className="text-sm text-white/70">{messages.compare.lowestKnownTotal}</p>
                <p className="mt-2 text-lg font-semibold">{messages.compare.pricesMissing}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/12 px-4 py-4">
                <p className="text-sm text-white/70">{messages.compare.worthIt}</p>
                <p className="mt-2 text-lg font-semibold">{messages.compare.pricesMissing}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/12 px-4 py-4">
                <p className="text-sm text-white/70">{messages.common.nearby}</p>
                <p className="mt-2 text-lg font-semibold">
                  {selectedList.list.radiusKm} {messages.common.kilometers}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-4">
            <CardHeader>
              <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                {messages.compare.pricesMissing}
              </Badge>
              <CardTitle>{messages.compare.pricesMissing}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-muted-foreground">
                {messages.compare.pricesMissingSubtitle}
              </p>
              <Button asChild variant="outline">
                <Link href={APP_ROUTES.prices}>
                  {messages.compare.pricesMissing}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="gap-4">
              <CardHeader>
                <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                  {messages.compare.listReady}
                </Badge>
                <CardTitle>{selectedList.list.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {selectedList.items.map((item) => (
                  <Badge className="rounded-full px-3 py-1" key={item.id} variant="secondary">
                    {item.quantity ? `${item.quantity} ` : ""}
                    {item.name}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="gap-4">
              <CardHeader>
                <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                  {messages.compare.savingsHistory}
                </Badge>
                <CardTitle>{messages.compare.savingsHistory}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {[
                  messages.dashboard.week,
                  messages.dashboard.month,
                ].map((label) => (
                  <div className="rounded-[1.35rem] bg-secondary px-4 py-4" key={label}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{label}</p>
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <TrendingUp className="size-4" />
                        {messages.compare.pricesMissing}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="gap-4">
            <CardHeader>
              <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                {messages.markets.routePreview}
              </Badge>
              <CardTitle>{bestMarket}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Store className="size-4 text-primary" />
                  {messages.common.favorites}
                </div>
              </div>
              <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <MapPin className="size-4 text-primary" />
                  {selectedList.list.radiusKm} {messages.common.kilometers}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
