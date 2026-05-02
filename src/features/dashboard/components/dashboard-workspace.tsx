"use client";

import { ArrowRight, ListTodo, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MetricCard } from "@/components/app/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_ROUTES } from "@/constants/app";
import { useAppMessages, useAppPreferences } from "@/features/preferences/provider";
import { getShoppingListsWithItems, type ShoppingListWithItems } from "@/features/shopping-lists/storage";

function getFirstName(name: string) {
  return name.trim().split(" ")[0] || name;
}

export function DashboardWorkspace({ userName }: { userName: string }) {
  const messages = useAppMessages();
  const { preferences, isReady } = useAppPreferences();
  const [lists, setLists] = useState<ShoppingListWithItems[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  useEffect(() => {
    async function loadLists() {
      setIsLoadingLists(true);
      const storedLists = await getShoppingListsWithItems();
      setLists(storedLists);
      setIsLoadingLists(false);
    }

    void loadLists();
  }, []);

  const latestList = lists[0] ?? null;
  const setupCards = useMemo(() => {
    const items = [];

    if (!preferences.locationLabel) {
      items.push({
        label: messages.dashboard.setLocation,
        href: APP_ROUTES.settings,
        icon: MapPin,
      });
    }

    if (preferences.favoriteMarkets.length === 0) {
      items.push({
        label: messages.dashboard.addFavorites,
        href: APP_ROUTES.settings,
        icon: Star,
      });
    }

    if (lists.length === 0) {
      items.push({
        label: messages.dashboard.createFirst,
        href: APP_ROUTES.lists,
        icon: ListTodo,
      });
    }

    return items;
  }, [lists.length, messages.dashboard.addFavorites, messages.dashboard.createFirst, messages.dashboard.setLocation, preferences.favoriteMarkets.length, preferences.locationLabel]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-3">
          <Badge className="rounded-full px-3 py-1" variant="secondary">
            {messages.navigation.home}
          </Badge>
          <div className="space-y-1">
            <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">
              {messages.dashboard.greeting}, {getFirstName(userName)}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">{messages.dashboard.title}</p>
          </div>
        </div>

        <Button asChild className="hidden h-12 px-5 sm:inline-flex" size="lg">
          <Link href={APP_ROUTES.lists}>{messages.common.createList}</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={messages.dashboard.week} tone="positive" value={messages.dashboard.saved} />
        <MetricCard label={messages.dashboard.month} tone="positive" value={messages.dashboard.saved} />
        <MetricCard
          label={messages.dashboard.nearby}
          tone="neutral"
          value={`${isReady ? preferences.radiusKm : 5} ${messages.common.kilometers}`}
          change={messages.dashboard.radiusStatus}
        />
        <MetricCard
          label={messages.dashboard.favorites}
          tone="neutral"
          value={String(isReady ? preferences.favoriteMarkets.length : 0)}
          change={messages.dashboard.favoritesStatus}
        />
      </div>

      <Card className="gap-5 bg-[linear-gradient(135deg,#1f8a5b_0%,#23796c_40%,#2c8a74_100%)] text-white ring-0">
        <CardHeader>
          <Badge className="w-fit rounded-full border-white/15 bg-white/12 px-3 py-1 text-white" variant="outline">
            {messages.dashboard.nextAction}
          </Badge>
          <CardTitle className="text-[1.8rem] text-white">
            {latestList ? messages.dashboard.startUsualList : messages.dashboard.createFirstList}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/12 px-3 py-1">
              {preferences.favoriteMarkets.length > 0 ? messages.common.favorites : messages.common.nearby}
            </span>
            <span className="rounded-full bg-white/12 px-3 py-1">
              {preferences.radiusKm} {messages.common.kilometers}
            </span>
            {latestList ? (
              <span className="rounded-full bg-white/12 px-3 py-1">{latestList.list.name}</span>
            ) : null}
          </div>
          <Button
            asChild
            className="h-12 bg-white text-primary hover:bg-white/92"
            size="lg"
          >
            <Link href={latestList ? `${APP_ROUTES.compare}?listId=${latestList.list.id}` : APP_ROUTES.lists}>
              {latestList ? messages.dashboard.continueCompare : messages.common.createList}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {setupCards.length > 0 ? (
        <Card className="gap-4">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              {messages.dashboard.setup}
            </Badge>
            <CardTitle>{messages.dashboard.setup}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {setupCards.map(({ label, href, icon: Icon }) => (
              <Link href={href} key={label}>
                <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary">
                      <Icon className="size-4" />
                    </div>
                    <p className="font-medium text-foreground">{label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="gap-4">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {messages.dashboard.recent}
          </Badge>
          <CardTitle>{messages.dashboard.recent}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLists ? (
            <div className="grid gap-3">
              <Skeleton className="h-16 w-full rounded-[1.35rem]" />
              <Skeleton className="h-16 w-full rounded-[1.35rem]" />
            </div>
          ) : latestList ? (
            <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{latestList.list.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {latestList.items.length} {messages.lists.items}
                  </p>
                </div>
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  {latestList.list.radiusKm} {messages.common.kilometers}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
              <p className="font-semibold text-foreground">{messages.dashboard.noList}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button asChild className="h-12 w-full text-base sm:hidden" size="lg">
        <Link href={APP_ROUTES.lists}>{messages.common.createList}</Link>
      </Button>
    </div>
  );
}
