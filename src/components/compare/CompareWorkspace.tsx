"use client";

import {
  ArrowRight,
  Clock3,
  ListTodo,
  MapPin,
  Store,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getShoppingListsWithItems, type ShoppingListWithItems } from "@/features/shopping-lists/storage";
import { APP_ROUTES } from "@/constants/app";
import { Badge } from "@/components/ui/badge";

const marketTotals = [
  { name: "Lidl", total: "Price data next", savings: "Savings placeholder", distance: "2.1 km", tone: "positive" },
  { name: "Continente", total: "Price data next", savings: "Savings placeholder", distance: "3.8 km", tone: "neutral" },
  { name: "Pingo Doce", total: "Price data next", savings: "Savings placeholder", distance: "1.6 km", tone: "warning" },
];

const matchCards = [
  {
    title: "Best balanced match",
    market: "Nearby favorite",
    reason: "This card will use list totals once price search lands.",
    total: "Waiting for prices",
    distance: "Route and radius stay visible here",
  },
  {
    title: "Closest stop",
    market: "Local market",
    reason: "Distance-first recommendation placeholder",
    total: "Waiting for prices",
    distance: "Short travel preview",
  },
];

const savingsHistory = [
  { period: "This week", amount: "Pending", summary: "Savings history will fill in after comparison starts." },
  { period: "This month", amount: "Pending", summary: "This section stays intentionally light in Phase 1." },
];

export function CompareWorkspace() {
  const searchParams = useSearchParams();
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

  return (
    <div className="space-y-6">
      <Card className="gap-5">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            Compare markets
          </Badge>
          <CardTitle className="text-2xl">Choose a saved list before comparing totals</CardTitle>
          <CardDescription>
            Phase 1 stops at the handoff: you can pick the list you just built, review
            its scope, and land in a comparison-ready placeholder without inventing prices.
          </CardDescription>
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
                <div className="rounded-[1.4rem] bg-secondary px-4 py-4 text-sm leading-6 text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{selectedList.list.name}</span>
                    <Badge className="rounded-full px-3 py-1" variant="secondary">
                      {selectedList.items.length} items
                    </Badge>
                    <Badge className="rounded-full px-3 py-1" variant="secondary">
                      {selectedList.list.radiusKm} km
                    </Badge>
                  </div>
                  <p className="mt-2">
                    Scope:{" "}
                    <span className="font-medium text-foreground">
                      {selectedList.list.marketScope === "favorites"
                        ? "Favorite markets only"
                        : "All nearby markets"}
                    </span>
                    . Price totals stay blank until the comparison engine arrives.
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyState
              description="Build a shopping list first, then come back here to compare nearby totals."
              eyebrow="No lists yet"
              title="Compare is waiting for your first saved list"
            >
              <Button asChild variant="outline">
                <Link href={APP_ROUTES.lists}>Create a shopping list</Link>
              </Button>
            </EmptyState>
          )}
        </CardContent>
      </Card>

      <Tabs className="gap-4" defaultValue="overview">
        <TabsList className="h-auto rounded-full bg-secondary p-1">
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="matches">
            Match cards
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="history">
            Savings history
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="overview">
          {selectedList ? (
            <>
              <Card className="gap-4">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                        Ready for comparison
                      </Badge>
                      <CardTitle>{selectedList.list.name}</CardTitle>
                      <CardDescription>
                        Review the saved items that will feed future market totals.
                      </CardDescription>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ListTodo className="size-[18px]" />
                    </div>
                  </div>
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

              <div className="grid gap-4 md:grid-cols-3">
                {marketTotals.map((market) => (
                  <Card className="gap-4" key={market.name}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <CardTitle>{market.name}</CardTitle>
                          <CardDescription>{market.distance}</CardDescription>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Store className="size-[18px]" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-[1.5rem] font-semibold tracking-tight text-foreground">
                        {market.total}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary">
                        {market.tone === "warning" ? (
                          <TrendingDown className="size-4" />
                        ) : (
                          <TrendingUp className="size-4" />
                        )}
                        {market.savings}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              description="Once a list is selected, the item summary and future totals will appear here."
              eyebrow="Overview"
              title="Choose a saved list first"
            />
          )}
        </TabsContent>

        <TabsContent className="space-y-4" value="matches">
          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
            {matchCards.map((card) => (
              <Card className="min-w-[18rem] snap-start gap-4 md:min-w-[20rem]" key={card.title}>
                <CardHeader>
                  <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                    {card.title}
                  </Badge>
                  <CardTitle className="text-xl">{card.market}</CardTitle>
                  <CardDescription>{card.reason}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[1.6rem] font-semibold tracking-tight text-foreground">
                    {card.total}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {card.distance}
                  </div>
                  <Button className="w-full" variant="outline">
                    View market details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="gap-5">
            <CardHeader>
              <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                Market details
              </Badge>
              <CardTitle className="text-2xl">Google Maps-style detail preview</CardTitle>
              <CardDescription>
                Address, distance, opening hours, rating, and route preview stay visual-only
                until map data and live comparison arrive.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
                ["Address", "Rua da Prata 112, Lisbon"],
                ["Distance", selectedList ? `${selectedList.list.radiusKm} km search radius` : "Nearby radius preview"],
                ["Opening hours", "08:00 - 22:00 today"],
                ["Rating", "4.5 / 5 from local shoppers"],
              ].map(([label, value]) => (
                <div className="rounded-[1.35rem] bg-secondary px-4 py-4" key={label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
                </div>
              ))}
              <div className="rounded-[1.35rem] bg-accent px-4 py-4 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Route preview
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  Future route guidance can live here. For now it keeps the location-aware
                  decision flow visible without calling Google Maps.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="history">
          {savingsHistory.map((entry) => (
            <Card className="gap-3" key={entry.period}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{entry.period}</CardTitle>
                    <CardDescription>{entry.summary}</CardDescription>
                  </div>
                  <Badge className="rounded-full px-3 py-1" variant="secondary">
                    History
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <p className="text-[1.6rem] font-semibold tracking-tight text-foreground">
                  {entry.amount}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Clock3 className="size-4" />
                  Savings view, not live analytics yet
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Button asChild className="h-12 w-full text-base" size="lg">
        <Link href={APP_ROUTES.markets}>
          Explore market details
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
