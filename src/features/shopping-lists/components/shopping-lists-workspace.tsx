"use client";

import {
  ArrowRight,
  LoaderCircle,
  Plus,
  RefreshCcw,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { APP_ROUTES } from "@/constants/app";
import { createParsedShoppingItem, normalizeItemName } from "@/features/list-parser/inference";
import type { ParseShoppingListResponse } from "@/features/list-parser/types";
import { useAppMessages, useAppPreferences } from "@/features/preferences/provider";
import { AiItemCard } from "@/features/shopping-lists/components/ai-item-card";
import { ShoppingListCard } from "@/features/shopping-lists/components/shopping-list-card";
import {
  createShoppingListFromDraft,
  getShoppingListsWithItems,
  mapShoppingListItemToParsed,
  updateShoppingListWithItems,
  type ShoppingListWithItems,
} from "@/features/shopping-lists/storage";
import {
  type ItemSuggestionOption,
  type ParsedShoppingItem,
  type ShoppingItemUnit,
  type ShoppingListDraft,
  type ShoppingListFrequency,
  type ShoppingListScope,
  type ShoppingListStatus,
} from "@/types/shopping-list";

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

function getDefaultListName(defaultName: string) {
  return defaultName;
}

function normalizeReviewItems(items: ParsedShoppingItem[]) {
  return items
    .map((item) => {
      const name = item.name.trim();

      return {
        ...item,
        originalText: item.originalText || item.rawText || name,
        rawText: item.rawText || item.originalText || name,
        name,
        normalizedName: normalizeItemName(name),
        quantity: item.quantity > 0 ? item.quantity : 1,
        unit: item.unit,
        suggestionGroups: item.suggestionGroups ?? [],
      };
    })
    .filter((item) => item.name.length > 0);
}

function formatReviewCount(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export function ShoppingListsWorkspace() {
  const router = useRouter();
  const messages = useAppMessages();
  const { locale, preferences, updatePreferences } = useAppPreferences();
  const [builder, setBuilder] = useState<BuilderState>({
    frequency: "weekly",
    marketScope: preferences.favoriteMarkets.length > 0 ? "favorites" : "all",
    radiusKm: preferences.radiusKm,
    sourceText: "",
  });
  const [shoppingLists, setShoppingLists] = useState<ShoppingListWithItems[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState<ShoppingListDraft | null>(null);
  const [reviewName, setReviewName] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<ShoppingListStatus>("active");

  const frequencyLabelMap: Record<ShoppingListFrequency, string> = {
    weekly: messages.common.weekly,
    biweekly: messages.common.biweekly,
    monthly: messages.common.monthly,
    "one-off": messages.common.oneOff,
  };

  const statusLabelMap: Record<ShoppingListStatus, string> = {
    draft: messages.lists.needsCheck,
    active: messages.lists.active,
    completed: messages.lists.completed,
  };

  const marketScopeLabel =
    builder.marketScope === "favorites" ? messages.common.favorites : messages.common.nearby;

  const reviewCount =
    reviewDraft?.parsedItems.filter(
      (item) => item.needsReview || item.suggestionGroups.length > 0,
    ).length ?? 0;

  const recentLists = shoppingLists.slice(0, 3);
  const activeLists = shoppingLists.filter((entry) => entry.list.status !== "completed");
  const completedLists = shoppingLists.filter((entry) => entry.list.status === "completed");

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
          preferences.favoriteMarkets.length > 0 ? current.marketScope : "all",
      }));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [preferences.favoriteMarkets.length, preferences.radiusKm]);

  function resetReview() {
    setReviewDraft(null);
    setReviewName("");
    setEditingListId(null);
    setEditingStatus("active");
    setParseError(null);
  }

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
      setParseError(messages.lists.addFewItems);
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
        body: JSON.stringify({ text: trimmedText, locale }),
      });

      const payload = (await response.json()) as ParseShoppingListResponse;

      if (!payload.ok) {
        setParseError(messages.lists.couldNotBuild);
        return;
      }

      const defaultName = getDefaultListName(messages.lists.listNamePlaceholder);

      setReviewName(defaultName);
      setEditingListId(null);
      setEditingStatus("active");
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
      setParseError(messages.lists.couldNotBuild);
    } finally {
      setIsParsing(false);
    }
  }

  function updateReviewItem(
    itemId: string,
    updater: (item: ParsedShoppingItem) => ParsedShoppingItem,
  ) {
    setReviewDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        parsedItems: currentDraft.parsedItems.map((item) =>
          item.id === itemId ? updater(item) : item,
        ),
      };
    });
  }

  function handleApplySuggestion(
    itemId: string,
    groupId: string,
    option: ItemSuggestionOption,
  ) {
    updateReviewItem(itemId, (item) => {
      const remainingGroups = item.suggestionGroups.filter((group) => group.id !== groupId);
      const nextItem = {
        ...item,
        ...option.updates,
        suggestionGroups: remainingGroups,
      };

      return {
        ...nextItem,
        needsReview:
          remainingGroups.length > 0 ? true : option.updates.needsReview ?? false,
        confidence: option.updates.confidence ?? (remainingGroups.length > 0 ? "medium" : "high"),
      };
    });
  }

  function handleNameChange(itemId: string, name: string) {
    updateReviewItem(itemId, (item) => ({
      ...item,
      name,
      normalizedName: normalizeItemName(name),
      rawText: item.rawText || name,
      needsReview: item.suggestionGroups.length > 0,
      confidence: item.confidence === "low" ? "medium" : item.confidence,
    }));
  }

  function handleQuantityChange(itemId: string, quantity: number) {
    updateReviewItem(itemId, (item) => ({
      ...item,
      quantity: Number(quantity.toFixed(2)),
      needsReview: item.suggestionGroups.length > 0,
      confidence: item.confidence === "low" ? "medium" : item.confidence,
    }));
  }

  function handleUnitChange(itemId: string, unit: ShoppingItemUnit) {
    updateReviewItem(itemId, (item) => ({
      ...item,
      unit,
      needsReview: item.suggestionGroups.length > 0,
      confidence: item.confidence === "low" ? "medium" : item.confidence,
    }));
  }

  function handleMarkReviewed(itemId: string) {
    updateReviewItem(itemId, (item) => ({
      ...item,
      needsReview: false,
      confidence: item.confidence === "low" ? "medium" : item.confidence,
      suggestionGroups: [],
    }));
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

      const item = createParsedShoppingItem(
        messages.lists.newItem,
        messages.lists.newItem,
        { locale },
      );

      return {
        ...currentDraft,
        parsedItems: [
          ...currentDraft.parsedItems,
          {
            ...item,
            needsReview: true,
            confidence: "low",
          },
        ],
      };
    });
  }

  function handleOpenList(entry: ShoppingListWithItems) {
    setParseError(null);
    setEditingListId(entry.list.id);
    setEditingStatus(entry.list.status);
    setReviewName(entry.list.name);
    setReviewDraft({
      name: entry.list.name,
      frequency: entry.list.frequency,
      marketScope: entry.list.marketScope,
      radiusKm: entry.list.radiusKm,
      sourceText: entry.list.sourceText,
      parsedItems: entry.items.map(mapShoppingListItemToParsed),
      parseProvider: entry.list.parseProvider,
      parseWarning: entry.list.parseWarning,
    });
  }

  async function saveCurrentList(shouldCompare: boolean) {
    if (!reviewDraft) {
      return;
    }

    const parsedItems = normalizeReviewItems(reviewDraft.parsedItems);

    if (parsedItems.length === 0) {
      setParseError(messages.lists.keepOneItem);
      return;
    }

    setIsSaving(true);
    setParseError(null);

    try {
      const listName =
        reviewName.trim() ||
        getDefaultListName(messages.lists.listNamePlaceholder);
      const saved = editingListId
        ? await updateShoppingListWithItems(editingListId, {
            name: listName,
            frequency: reviewDraft.frequency,
            marketScope: reviewDraft.marketScope,
            radiusKm: reviewDraft.radiusKm,
            status: editingStatus,
            sourceText: reviewDraft.sourceText,
            parseProvider: reviewDraft.parseProvider,
            parseWarning: reviewDraft.parseWarning,
            parsedItems,
          })
        : await createShoppingListFromDraft({
            ...reviewDraft,
            name: listName,
            parsedItems,
          });

      resetReview();
      setBuilder((current) => ({
        ...current,
        sourceText: "",
      }));
      await refreshLists();

      if (shouldCompare) {
        router.push(`${APP_ROUTES.compare}?listId=${saved.list.id}`);
      }
    } catch {
      setParseError(messages.lists.couldNotSave);
    } finally {
      setIsSaving(false);
    }
  }

  const listTabs = [
    {
      key: "recent",
      label: messages.lists.recent,
      lists: recentLists,
      empty: messages.lists.noRecent,
      emptySubtitle: messages.lists.noRecentSubtitle,
    },
    {
      key: "active",
      label: messages.lists.active,
      lists: activeLists,
      empty: messages.lists.noActive,
      emptySubtitle: messages.lists.noActiveSubtitle,
    },
    {
      key: "completed",
      label: messages.lists.completed,
      lists: completedLists,
      empty: messages.lists.completed,
      emptySubtitle: "",
    },
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
              className="min-h-40 text-lg leading-7"
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
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  {reviewDraft.marketScope === "favorites"
                    ? messages.common.favorites
                    : messages.common.nearby}
                </Badge>
              </div>
              <CardTitle>{messages.lists.looksGood}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                className="h-12 rounded-[1.2rem] bg-secondary px-4 text-base font-semibold"
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

              {reviewCount > 0 ? (
                <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                  {formatReviewCount(messages.lists.reviewItems, reviewCount)}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button onClick={resetReview} type="button" variant="outline">
                  <RefreshCcw className="size-4" />
                  {messages.lists.editList}
                </Button>
                <Button onClick={handleAddItem} type="button" variant="ghost">
                  <Plus className="size-4" />
                  {messages.lists.addItem}
                </Button>
                {editingListId ? (
                  <Button
                    disabled={isSaving}
                    onClick={() => void saveCurrentList(false)}
                    type="button"
                    variant="ghost"
                  >
                    <Save className="size-4" />
                    {messages.lists.saveList}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {reviewDraft.parsedItems.map((item) => (
              <AiItemCard
                item={item}
                key={item.id}
                messages={{
                  suggested: messages.lists.suggested,
                  needsCheck: messages.lists.needsCheck,
                  looksGood: messages.lists.looksGood,
                  missingQuantity: messages.lists.missingQuantity,
                  removeItem: messages.lists.removeItem,
                  unit: messages.lists.unit,
                  whichOne: messages.lists.whichOne,
                  howMany: messages.lists.howMany,
                  whichUnit: messages.lists.whichUnit,
                }}
                onApplySuggestion={handleApplySuggestion}
                onMarkReviewed={handleMarkReviewed}
                onNameChange={handleNameChange}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveReviewItem}
                onUnitChange={handleUnitChange}
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
            disabled={isSaving || reviewCount > 0}
            onClick={() => void saveCurrentList(true)}
            size="lg"
            type="button"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                {messages.common.loading}...
              </>
            ) : reviewCount > 0 ? (
              formatReviewCount(messages.lists.reviewItems, reviewCount)
            ) : (
              <>
                {messages.lists.compare}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}

      <Tabs className="gap-4" defaultValue="recent">
        <TabsList className="h-auto rounded-full bg-secondary p-1" variant="default">
          {listTabs.map((tab) => (
            <TabsTrigger
              className="rounded-full px-4 py-2 data-active:bg-card"
              key={tab.key}
              value={tab.key}
            >
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
              tab.lists.map((entry) => (
                <ShoppingListCard
                  entry={entry}
                  frequencyLabelMap={frequencyLabelMap}
                  itemsLabel={messages.lists.items}
                  key={entry.list.id}
                  kilometersLabel={messages.common.kilometers}
                  onOpen={() => handleOpenList(entry)}
                  statusLabelMap={statusLabelMap}
                />
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
