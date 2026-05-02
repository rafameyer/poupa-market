"use client";

import { ArrowRight, Clock3, MapPin, Store, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const compareLists = [
  "Weekly essentials",
  "Family pantry top-up",
  "Weekend fresh run",
];

const marketTotals = [
  { name: "Lidl", total: "€42.70", savings: "Save €6.10", distance: "2.1 km", tone: "positive" },
  { name: "Continente", total: "€45.20", savings: "Save €3.60", distance: "3.8 km", tone: "neutral" },
  { name: "Pingo Doce", total: "€47.10", savings: "Save €1.70", distance: "1.6 km", tone: "warning" },
];

const matchCards = [
  {
    title: "Best balanced match",
    market: "Lidl",
    reason: "Cheapest total with short distance",
    total: "€42.70",
    distance: "2.1 km away",
  },
  {
    title: "Closest favorite",
    market: "Pingo Doce",
    reason: "Fastest stop if convenience matters most",
    total: "€47.10",
    distance: "1.6 km away",
  },
  {
    title: "Best for pantry fill-ups",
    market: "Continente",
    reason: "Wider basket coverage for larger monthly lists",
    total: "€45.20",
    distance: "3.8 km away",
  },
];

const savingsHistory = [
  { period: "This week", amount: "€6.10", summary: "Weekly essentials vs average nearby total" },
  { period: "This month", amount: "€24.80", summary: "Four trips completed with favorite-market mix" },
  { period: "Last month", amount: "€19.40", summary: "Higher spend, but steadier savings on staples" },
];

export function CompareWorkspace() {
  const [selectedList, setSelectedList] = useState(compareLists[0]);

  return (
    <div className="space-y-6">
      <Card className="gap-5">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            Compare markets
          </Badge>
          <CardTitle className="text-2xl">Choose a list before comparing nearby totals</CardTitle>
          <CardDescription>
            This keeps the future flow explicit: complete a list, select it here,
            then browse totals, matches, and savings without dropping into dense
            mobile tables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            className="flex flex-wrap gap-2"
            onValueChange={(value) => value && setSelectedList(value)}
            type="single"
            value={selectedList}
          >
            {compareLists.map((list) => (
              <ToggleGroupItem className="rounded-full px-4" key={list} value={list}>
                {list}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="rounded-[1.4rem] bg-secondary px-4 py-4 text-sm leading-6 text-muted-foreground">
            Selected list: <span className="font-semibold text-foreground">{selectedList}</span>.
            Totals and savings below stay as UI placeholders in this phase.
          </div>
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
                  <p className="text-[1.8rem] font-semibold tracking-tight text-foreground">
                    {market.total}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    {market.tone === "warning" ? <TrendingDown className="size-4" /> : <TrendingUp className="size-4" />}
                    {market.savings}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <p className="text-[1.9rem] font-semibold tracking-tight text-foreground">
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
                This phase keeps it visual only: address, distance, opening hours,
                rating, and route preview blocks without any live map integration.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
                ["Address", "Rua da Prata 112, Lisbon"],
                ["Distance", "2.1 km from your current area"],
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
                  A future map preview can live here. For now this block anchors the
                  direction, travel trust, and nearby-market decision flow.
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
                <p className="text-[1.8rem] font-semibold tracking-tight text-foreground">
                  {entry.amount}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Clock3 className="size-4" />
                  Savings view, not full analytics yet
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Button asChild className="h-12 w-full text-base" size="lg">
        <Link href="/markets">
          Explore market details
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
