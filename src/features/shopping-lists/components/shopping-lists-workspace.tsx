"use client";

import {
  ArrowRight,
  LoaderCircle,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ParseShoppingListResponse } from "@/features/list-parser/types";
import { useAppMessages, useAppPreferences } from "@/features/preferences/provider";
import {
  createShoppingListFromDraft,
  getShoppingListsWithItems,
  type ShoppingListWithItems,
} from "@/features/shopping-lists/storage";
import { APP_ROUTES } from "@/constants/app";
import {
  type ParsedShoppingItem,
  type ShoppingListDraft,
  type ShoppingListFrequency,
  type ShoppingListScope,
} from "@/types/shopping-list";
import { Badge } from "@/components/ui/badge";

const SAMPLE_LIST_TEXT = "milk, eggs, rice";
const FREQUENCY_ORDER: ShoppingListFrequency[] = [
  "weekly",
  "biweekly",
  "monthly",
  "one-off",
];
const RADIUS_ORDER = [1, 5, 10, 20] as const;

interface BuilderState {
  frequency: ShoppingListFrequency;
  marketScope: ShoppingListScope;
  radiusKm: number;
  sourceText: string;
}

function getDefaultListName(frequency: ShoppingListFrequency) {
  const labels: Record<ShoppingListFrequency, string> = {
    weekly: "Weekly grocery run",
    biweekly: "Biweekly grocery run",
    monthly: "Monthly pantry refill",
    "one-off": "One-off grocery run",
  };

  return labels[frequency];
}

function ReviewRow({
  item,
  onChange,
  onRemove,
  quantityLabel,
  unitLabel,
}: {
  item: ParsedShoppingItem;
  onChange: (itemId: string, field: keyof ParsedShoppingItem, value: string) => void;
  onRemove: (itemId: string) => void;
  quantityLabel: string;
  unitLabel: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-border bg-card px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_6rem_6rem_auto]">
        <div className="space-y-2">
          <label className="sr-only" htmlFor={`item-${item.id}`}>
            Item
          </label>
          <Input
            className="h-11 rounded-[1.1rem] bg-secondary px-4"
            id={`item-${item.id}`}
            onChange={(event) => onChange(item.id, "name", event.target.value)}
            placeholder="milk"
            type="text"
            value={item.name}
          />
        </div>

        <div className="space-y-2">
          <label className="sr-only" htmlFor={`item-quantity-${item.id}`}>
            {quantityLabel}
          </label>
          <Input
            className="h-11 rounded-[1.1rem] bg-secondary px-4"
            id={`item-quantity-${item.id}`}
            inputMode="decimal"
            onChange={(event) => onChange(item.id, "quantity", event.target.value)}
            placeholder={quantityLabel}
            type="text"
            value={item.quantity ?? ""}
          />
        </div>

        <div className="space-y-2">
          <label className="sr-only" htmlFor={`item-unit-${item.id}`}>
            {unitLabel}
          </label>
          <Input
            className="h-11 rounded-[1.1rem] bg-secondary px-4"
            id={`item-unit-${item.id}`}
            onChange={(event) => onChange(item.id, "unit", event.target.value)}
            placeholder={unitLabel}
            type="text"
            value={item.unit ?? ""}
          />
        </div>

        <Button
          aria-label={`Remove ${item.name || "item"}`}
          className="h-11 px-3"
          onClick={() => onRemove(item.id)}
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ShoppingListsWorkspace() {
  const router = useRouter();
  const messages = useAppMessages();
  const { preferences, updatePreferences } = useAppPreferences();
  const [builder, setBuilder] = useState<BuilderState>({
    frequency: "weekly",
    marketScope: preferences.favoriteMarkets.length > 0 ? "favorites" : "all",
    radiusKm: preferences.radiusKm,
    sourceText: SAMPLE_LIST_TEXT,
  });
  const [shoppingLists, setShoppingLists] = useState<ShoppingListWithItems[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState<ShoppingListDraft | null>(null);
  const [reviewName, setReviewName] = useState("");

  useEffect(() => {
    async function loadLists() {
      setIsHydrated(false);
      const storedLists = await getShoppingListsWithItems();
      setShoppingLists(storedLists);
      setIsHydrated(true);
    }

    void loadLists();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setBuilder((current) => ({
        ...current,
        radiusKm: preferences.radiusKm,
        marketScope:
          preferences.favoriteMarkets.length > 0
            ? current.marketScope
            : "all",
      }));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [preferences.favoriteMarkets.length, preferences.radiusKm]);

  const recentLists = shoppingLists.slice(0, 3);
  const pendingLists = shoppingLists.filter((entry) => entry.list.status !== "completed");
  const completedLists = shoppingLists.filter((entry) => entry.list.status === "completed");

  const frequencyLabelMap: Record<ShoppingListFrequency, string> = {
    weekly: messages.common.weekly,
    biweekly: messages.common.biweekly,
    monthly: messages.common.monthly,
    "one-off": messages.common.oneOff,
  };

  const marketScopeLabel =
    builder.marketScope === "favorites" ? messages.common.favorites : messages.common.nearby;

  function cycleFrequency() {
    setBuilder((current) => {
      const index = FREQUENCY_ORDER.indexOf(current.frequency);
      return {
        ...current,
        frequency: FREQUENCY_ORDER[(index + 1) % FREQUENCY_ORDER.length],
      };
    });
  }

  function cycleRadius() {
    setBuilder((current) => {
      const index = RADIUS_ORDER.indexOf(current.radiusKm as (typeof RADIUS_ORDER)[number]);
      const radiusKm = RADIUS_ORDER[(index + 1) % RADIUS_ORDER.length];

      updatePreferences({ radiusKm });

      return {
        ...current,
        radiusKm,
      };
    });
  }

  function toggleMarketScope() {
    setBuilder((current) => {
      const nextScope: ShoppingListScope =
        current.marketScope === "favorites" || preferences.favoriteMarkets.length === 0
          ? "all"
          : "favorites";

      updatePreferences({
        marketScope: nextScope === "favorites" ? "favorites" : "nearby",
      });

      return {
        ...current,
        marketScope: nextScope,
      };
    });
  }

  async function refreshLists() {
    const storedLists = await getShoppingListsWithItems();
    setShoppingLists(storedLists);
  }

  async function handleBuildList() {
    const trimmedText = builder.sourceText.trim();

    if (!trimmedText) {
      setParseError("Add a few items first.");
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const response = await fetch("/api/list-parser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmedText }),
      });

      const payload = (await response.json()) as ParseShoppingListResponse;

      if (!payload.ok) {
        setParseError(payload.error);
        return;
      }

      const defaultName = getDefaultListName(builder.frequency);

      setReviewName(defaultName);
      setReviewDraft({
        name: defaultName,
        frequency: builder.frequency,
        marketScope: builder.marketScope,
        radiusKm: builder.radiusKm,
        sourceText: trimmedText,
        parsedItems: payload.items,
        parseProvider: payload.provider,
        parseWarning: payload.warning,
      });
    } catch {
      setParseError("We could not build your list.");
    } finally {
      setIsParsing(false);
    }
  }

  function handleReviewItemChange(
    itemId: string,
    field: keyof ParsedShoppingItem,
    value: string,
  ) {
    setReviewDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        parsedItems: currentDraft.parsedItems.map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          if (field === "quantity") {
            const trimmedValue = value.trim();
            const parsedValue = trimmedValue ? Number(trimmedValue.replace(",", ".")) : null;

            return {
              ...item,
              quantity: trimmedValue && Number.isFinite(parsedValue) ? parsedValue : null,
            };
          }

          if (field === "unit") {
            return {
              ...item,
              unit: value.trim() || null,
            };
          }

          return {
            ...item,
            [field]: value,
          };
        }),
      };
    });
  }

  function handleRemoveReviewItem(itemId: string) {
    setReviewDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        parsedItems: currentDraft.parsedItems.filter((item) => item.id !== itemId),
      };
    });
  }

  function handleAddItem() {
    setReviewDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        parsedItems: [
          ...currentDraft.parsedItems,
          {
            id: crypto.randomUUID(),
            rawText: "Added manually",
            name: "",
            normalizedName: "",
            quantity: null,
            unit: null,
            category: "other",
            notes: null,
          },
        ],
      };
    });
  }

  async function handleConfirmList() {
    if (!reviewDraft) {
      return;
    }

    const parsedItems = reviewDraft.parsedItems
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        normalizedName: item.name.trim().toLowerCase(),
        unit: item.unit?.trim().toLowerCase() || null,
      }))
      .filter((item) => item.name.length > 0);

    if (parsedItems.length === 0) {
      setParseError("Keep at least one item.");
      return;
    }

    setIsSaving(true);
    setParseError(null);

    try {
      const created = await createShoppingListFromDraft({
        ...reviewDraft,
        name: reviewName.trim() || getDefaultListName(reviewDraft.frequency),
        parsedItems,
      });

      setReviewDraft(null);
      setReviewName("");
      setBuilder((current) => ({
        ...current,
        sourceText: "",
      }));
      await refreshLists();
      router.push(`${APP_ROUTES.compare}?listId=${created.list.id}`);
    } catch {
      setParseError("We could not save your list.");
    } finally {
      setIsSaving(false);
    }
  }

  const listTabs = [
    { key: "recent", label: messages.lists.recent, lists: recentLists, empty: messages.lists.noRecent, emptySubtitle: messages.lists.noRecentSubtitle },
    { key: "pending", label: messages.lists.pending, lists: pendingLists, empty: messages.lists.noPending, emptySubtitle: messages.lists.noPendingSubtitle },
    { key: "completed", label: messages.lists.completed, lists: completedLists, empty: messages.lists.completed, emptySubtitle: "" },
  ] as const;

  return (
    <div className="space-y-6">
      {!reviewDraft ? (
        <Card className="gap-5">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              {messages.lists.smartDefaults}
            </Badge>
            <CardTitle className="text-[2rem]">{messages.lists.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Textarea
              className="min-h-36 text-base"
              id="shopping-list-text"
              onChange={(event) =>
                setBuilder((current) => ({ ...current, sourceText: event.target.value }))
              }
              placeholder={messages.lists.listPlaceholder}
              value={builder.sourceText}
            />

            <div className="flex flex-wrap gap-2">
              <Button onClick={cycleFrequency} type="button" variant="outline">
                {frequencyLabelMap[builder.frequency]}
              </Button>
              <Button onClick={cycleRadius} type="button" variant="outline">
                {builder.radiusKm} {messages.common.kilometers}
              </Button>
              <Button
                disabled={preferences.favoriteMarkets.length === 0}
                onClick={toggleMarketScope}
                type="button"
                variant="outline"
              >
                {marketScopeLabel}
              </Button>
            </div>

            {parseError ? (
              <div className="rounded-[1.35rem] border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm leading-6 text-destructive">
                {parseError}
              </div>
            ) : null}

            <Button
              className="h-12 w-full text-base"
              disabled={isParsing}
              onClick={handleBuildList}
              size="lg"
              type="button"
            >
              {isParsing ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  {messages.lists.building}
                </>
              ) : (
                <>
                  {messages.lists.build}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="gap-4">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  {messages.lists.looksGood}
                </Badge>
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  {frequencyLabelMap[reviewDraft.frequency]}
                </Badge>
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  {reviewDraft.radiusKm} {messages.common.kilometers}
                </Badge>
              </div>
              <CardTitle>{messages.lists.looksGood}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                className="h-12 rounded-[1.2rem] bg-secondary px-4"
                onChange={(event) => setReviewName(event.target.value)}
                placeholder={messages.lists.listNamePlaceholder}
                type="text"
                value={reviewName}
              />

              {reviewDraft.parseWarning ? (
                <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                  {messages.lists.backupParser}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setReviewDraft(null)} type="button" variant="outline">
                  <RefreshCcw className="size-4" />
                  {messages.lists.editList}
                </Button>
                <Button onClick={handleAddItem} type="button" variant="ghost">
                  <Plus className="size-4" />
                  {messages.lists.addItem}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {reviewDraft.parsedItems.map((item) => (
              <ReviewRow
                item={item}
                key={item.id}
                onChange={handleReviewItemChange}
                onRemove={handleRemoveReviewItem}
                quantityLabel={messages.lists.quantity}
                unitLabel={messages.lists.unit}
              />
            ))}
          </div>

          {parseError ? (
            <div className="rounded-[1.35rem] border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm leading-6 text-destructive">
              {parseError}
            </div>
          ) : null}

          <Button
            className="h-12 w-full text-base"
            disabled={isSaving}
            onClick={handleConfirmList}
            size="lg"
            type="button"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                {messages.common.loading}...
              </>
            ) : (
              <>
                {messages.common.comparePrices}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}

      <Tabs className="gap-4" defaultValue="recent">
        <TabsList className="h-auto rounded-full bg-secondary p-1" variant="default">
          {listTabs.map((tab) => (
            <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {listTabs.map((tab) => (
          <TabsContent className="grid gap-4 md:grid-cols-2" key={tab.key} value={tab.key}>
            {!isHydrated ? (
              [0, 1].map((entry) => (
                <Card className="gap-4" key={entry}>
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-20 w-full rounded-[1.2rem]" />
                </Card>
              ))
            ) : tab.lists.length > 0 ? (
              tab.lists.map((list) => (
                <Card className="gap-4" key={list.list.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <Badge className="rounded-full px-3 py-1" variant="secondary">
                          {frequencyLabelMap[list.list.frequency]}
                        </Badge>
                        <CardTitle>{list.list.name}</CardTitle>
                      </div>
                      <Badge className="rounded-full px-3 py-1" variant="secondary">
                        {list.list.radiusKm} {messages.common.kilometers}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {list.items.slice(0, 3).map((item) => (
                      <Badge className="rounded-full px-3 py-1" key={item.id} variant="secondary">
                        {item.name}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState description={tab.emptySubtitle || undefined} title={tab.empty} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
