"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  LoaderCircle,
  Plus,
  RefreshCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ParseShoppingListResponse } from "@/features/list-parser/types";
import {
  createShoppingListFromDraft,
  getShoppingListsWithItems,
  type ShoppingListWithItems,
} from "@/features/shopping-lists/storage";
import { APP_ROUTES } from "@/constants/app";
import {
  SHOPPING_ITEM_CATEGORIES,
  type ParsedShoppingItem,
  type ShoppingItemCategory,
  type ShoppingListDraft,
  type ShoppingListFrequency,
  type ShoppingListScope,
} from "@/types/shopping-list";
import { Badge } from "@/components/ui/badge";

const SAMPLE_LIST_TEXT = "sugar, flour, salt, rice, milk, eggs";
const FREQUENCY_OPTIONS: { label: string; value: ShoppingListFrequency }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
  { label: "One-off", value: "one-off" },
];
const RADIUS_OPTIONS = ["1", "5", "10", "20", "custom"] as const;
const COMPLETED_PLACEHOLDERS = [
  {
    name: "Family pantry refill",
    cadence: "Monthly",
    items: "26 items",
    note: "Saved an estimated €12.40 before checkout.",
  },
];

interface BuilderState {
  name: string;
  frequency: ShoppingListFrequency;
  marketScope: ShoppingListScope;
  radiusChoice: (typeof RADIUS_OPTIONS)[number];
  customRadiusKm: string;
  sourceText: string;
}

function getInitialBuilderState(): BuilderState {
  return {
    name: "",
    frequency: "weekly",
    marketScope: "favorites",
    radiusChoice: "10",
    customRadiusKm: "",
    sourceText: SAMPLE_LIST_TEXT,
  };
}

function formatFrequencyLabel(value: ShoppingListFrequency) {
  return FREQUENCY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function buildDefaultListName(frequency: ShoppingListFrequency) {
  const labels: Record<ShoppingListFrequency, string> = {
    weekly: "Weekly grocery run",
    biweekly: "Biweekly grocery run",
    monthly: "Monthly pantry refill",
    "one-off": "One-off grocery run",
  };

  return labels[frequency];
}

function getRadiusValue(state: BuilderState) {
  const rawValue = state.radiusChoice === "custom" ? state.customRadiusKm : state.radiusChoice;
  const parsed = Number(rawValue);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeReviewItems(items: ParsedShoppingItem[]) {
  return items.filter((item) => item.name.trim().length > 0);
}

function formatItemSummary(list: ShoppingListWithItems) {
  return `${list.items.length} item${list.items.length === 1 ? "" : "s"}`;
}

function ListCard({ list }: { list: ShoppingListWithItems }) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              {formatFrequencyLabel(list.list.frequency)}
            </Badge>
            <CardTitle>{list.list.name}</CardTitle>
            <CardDescription>{formatItemSummary(list)}</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {list.list.radiusKm} km
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-6 text-muted-foreground">
          {list.list.marketScope === "favorites"
            ? "Favorite markets only"
            : "All nearby markets"}
        </p>
        <div className="flex flex-wrap gap-2">
          {list.items.slice(0, 3).map((item) => (
            <Badge className="rounded-full px-3 py-1" key={item.id} variant="secondary">
              {item.name}
            </Badge>
          ))}
          {list.items.length > 3 ? (
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              +{list.items.length - 3} more
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewItemCard({
  item,
  onChange,
  onRemove,
}: {
  item: ParsedShoppingItem;
  onChange: (itemId: string, field: keyof ParsedShoppingItem, value: string) => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <Card className="gap-4" size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-[15px]">{item.name || "Untitled item"}</CardTitle>
            <CardDescription>{item.rawText}</CardDescription>
          </div>
          <Button
            aria-label={`Remove ${item.name || "item"}`}
            onClick={() => onRemove(item.id)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor={`item-name-${item.id}`}>
            Item name
          </label>
          <Input
            className="h-11 rounded-[1.2rem] bg-card px-4"
            id={`item-name-${item.id}`}
            onChange={(event) => onChange(item.id, "name", event.target.value)}
            type="text"
            value={item.name}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor={`item-quantity-${item.id}`}>
              Quantity
            </label>
            <Input
              className="h-11 rounded-[1.2rem] bg-card px-4"
              id={`item-quantity-${item.id}`}
              inputMode="decimal"
              onChange={(event) => onChange(item.id, "quantity", event.target.value)}
              placeholder="Optional"
              type="text"
              value={item.quantity ?? ""}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor={`item-unit-${item.id}`}>
              Unit
            </label>
            <Input
              className="h-11 rounded-[1.2rem] bg-card px-4"
              id={`item-unit-${item.id}`}
              onChange={(event) => onChange(item.id, "unit", event.target.value)}
              placeholder="kg, pcs, pack..."
              type="text"
              value={item.unit ?? ""}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor={`item-category-${item.id}`}>
              Category
            </label>
            <select
              className="h-11 w-full rounded-[1.2rem] border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              id={`item-category-${item.id}`}
              onChange={(event) => onChange(item.id, "category", event.target.value)}
              value={item.category}
            >
              {SHOPPING_ITEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.replaceAll("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor={`item-notes-${item.id}`}>
              Notes
            </label>
            <Input
              className="h-11 rounded-[1.2rem] bg-card px-4"
              id={`item-notes-${item.id}`}
              onChange={(event) => onChange(item.id, "notes", event.target.value)}
              placeholder="Whole wheat, low fat..."
              type="text"
              value={item.notes ?? ""}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ShoppingListsWorkspace() {
  const router = useRouter();
  const [builder, setBuilder] = useState<BuilderState>(getInitialBuilderState);
  const [shoppingLists, setShoppingLists] = useState<ShoppingListWithItems[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState<ShoppingListDraft | null>(null);

  useEffect(() => {
    async function loadLists() {
      setIsHydrated(false);
      const storedLists = await getShoppingListsWithItems();
      setShoppingLists(storedLists);
      setIsHydrated(true);
    }

    void loadLists();
  }, []);

  const recentLists = shoppingLists.slice(0, 4);
  const pendingLists = shoppingLists.filter((entry) => entry.list.status !== "completed");
  const completedLists = shoppingLists.filter((entry) => entry.list.status === "completed");

  async function refreshLists() {
    const storedLists = await getShoppingListsWithItems();
    setShoppingLists(storedLists);
  }

  async function handleBuildList() {
    const trimmedText = builder.sourceText.trim();
    const radiusKm = getRadiusValue(builder);

    if (!trimmedText) {
      setParseError("Add a few grocery items before building the list.");
      return;
    }

    if (!radiusKm) {
      setParseError("Choose a valid radius in kilometers before continuing.");
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

      setReviewDraft({
        name: builder.name.trim() || buildDefaultListName(builder.frequency),
        frequency: builder.frequency,
        marketScope: builder.marketScope,
        radiusKm,
        sourceText: trimmedText,
        parsedItems: payload.items,
        parseProvider: payload.provider,
        parseWarning: payload.warning,
      });
    } catch {
      setParseError("We could not parse that list right now. Please try again in a moment.");
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

          if (field === "category") {
            return {
              ...item,
              category: value as ShoppingItemCategory,
            };
          }

          if (field === "unit") {
            return {
              ...item,
              unit: value.trim() || null,
            };
          }

          if (field === "notes") {
            return {
              ...item,
              notes: value.trim() || null,
            };
          }

          if (field === "normalizedName") {
            return {
              ...item,
              normalizedName: value.trim().toLowerCase(),
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

    const cleanedItems = normalizeReviewItems(
      reviewDraft.parsedItems.map((item) => ({
        ...item,
        normalizedName: item.normalizedName.trim().toLowerCase() || item.name.trim().toLowerCase(),
        name: item.name.trim(),
        unit: item.unit?.trim().toLowerCase() || null,
        notes: item.notes?.trim() || null,
      })),
    );

    if (cleanedItems.length === 0) {
      setParseError("Keep at least one grocery item before saving the list.");
      return;
    }

    setIsSaving(true);
    setParseError(null);

    try {
      const created = await createShoppingListFromDraft({
        ...reviewDraft,
        parsedItems: cleanedItems,
      });

      setReviewDraft(null);
      setBuilder(getInitialBuilderState());
      await refreshLists();
      router.push(`${APP_ROUTES.compare}?listId=${created.list.id}`);
    } catch {
      setParseError("We could not save your list locally. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs className="gap-4" defaultValue="recent">
        <TabsList className="h-auto rounded-full bg-secondary p-1" variant="default">
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="recent">
            Recent
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="pending">
            Pending
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="completed">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent className="grid gap-4 md:grid-cols-2" value="recent">
          {!isHydrated
            ? [0, 1].map((entry) => (
                <Card className="gap-4" key={entry}>
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-20 w-full rounded-[1.2rem]" />
                </Card>
              ))
            : recentLists.length > 0
              ? recentLists.map((list) => <ListCard key={list.list.id} list={list} />)
              : (
                <EmptyState
                  description="Your saved shopping lists will appear here once you build and confirm them."
                  eyebrow="Recent"
                  title="No recent lists yet"
                />
              )}
        </TabsContent>

        <TabsContent className="grid gap-4 md:grid-cols-2" value="pending">
          {!isHydrated
            ? [0, 1].map((entry) => (
                <Card className="gap-4" key={entry}>
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-20 w-full rounded-[1.2rem]" />
                </Card>
              ))
            : pendingLists.length > 0
              ? pendingLists.map((list) => <ListCard key={list.list.id} list={list} />)
              : (
                <EmptyState
                  description="Build a new list from free text and it will stay here until comparison and future checkout steps."
                  eyebrow="Pending"
                  title="Nothing pending yet"
                />
              )}
        </TabsContent>

        <TabsContent className="grid gap-4 md:grid-cols-2" value="completed">
          {completedLists.length > 0
            ? completedLists.map((list) => <ListCard key={list.list.id} list={list} />)
            : COMPLETED_PLACEHOLDERS.map((list) => (
                <Card className="gap-4" key={list.name}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <Badge className="rounded-full px-3 py-1" variant="secondary">
                          {list.cadence}
                        </Badge>
                        <CardTitle>{list.name}</CardTitle>
                        <CardDescription>{list.items}</CardDescription>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        History
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{list.note}</p>
                  </CardContent>
                </Card>
              ))}
        </TabsContent>
      </Tabs>

      {!reviewDraft ? (
        <Card className="gap-5">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              Create shopping list
            </Badge>
            <CardTitle className="text-2xl">Build a grocery list from free text</CardTitle>
            <CardDescription>
              Type the list the way you naturally think about it. We&apos;ll turn it into
              structured grocery items, then let you review everything before saving.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="list-name">
                List name
              </label>
              <Input
                className="h-12 rounded-[1.3rem] bg-card px-4"
                id="list-name"
                onChange={(event) =>
                  setBuilder((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Optional. We can name it for you."
                type="text"
                value={builder.name}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Shopping type</p>
              <ToggleGroup
                className="flex flex-wrap gap-2"
                onValueChange={(value) =>
                  value &&
                  setBuilder((current) => ({
                    ...current,
                    frequency: value as ShoppingListFrequency,
                  }))
                }
                type="single"
                value={builder.frequency}
              >
                {FREQUENCY_OPTIONS.map((option) => (
                  <ToggleGroupItem className="rounded-full px-4" key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Market scope</p>
              <ToggleGroup
                onValueChange={(value) =>
                  value &&
                  setBuilder((current) => ({
                    ...current,
                    marketScope: value as ShoppingListScope,
                  }))
                }
                type="single"
                value={builder.marketScope}
              >
                <ToggleGroupItem className="rounded-full px-4" value="favorites">
                  Favorite markets only
                </ToggleGroupItem>
                <ToggleGroupItem className="rounded-full px-4" value="all">
                  All markets
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Nearby radius</p>
              <ToggleGroup
                className="flex flex-wrap gap-2"
                onValueChange={(value) =>
                  value &&
                  setBuilder((current) => ({
                    ...current,
                    radiusChoice: value as BuilderState["radiusChoice"],
                  }))
                }
                type="single"
                value={builder.radiusChoice}
              >
                {RADIUS_OPTIONS.map((value) => (
                  <ToggleGroupItem className="rounded-full px-4" key={value} value={value}>
                    {value === "custom" ? "Custom" : `${value} km`}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              {builder.radiusChoice === "custom" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="custom-radius">
                    Custom radius in km
                  </label>
                  <Input
                    className="h-12 rounded-[1.3rem] bg-card px-4"
                    id="custom-radius"
                    inputMode="decimal"
                    onChange={(event) =>
                      setBuilder((current) => ({
                        ...current,
                        customRadiusKm: event.target.value,
                      }))
                    }
                    placeholder="15"
                    type="text"
                    value={builder.customRadiusKm}
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="shopping-list-text">
                Grocery list
              </label>
              <Textarea
                className="min-h-36"
                id="shopping-list-text"
                onChange={(event) =>
                  setBuilder((current) => ({ ...current, sourceText: event.target.value }))
                }
                placeholder="sugar, flour, salt, rice, milk, eggs"
                value={builder.sourceText}
              />
              <p className="text-sm leading-6 text-muted-foreground">
                Separate items with commas or line breaks. We only parse and organize the
                list here, without prices or market data yet.
              </p>
            </div>

            {parseError ? (
              <div className="rounded-[1.35rem] border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm leading-6 text-destructive">
                {parseError}
              </div>
            ) : null}

            <div className="rounded-[1.4rem] bg-secondary px-4 py-4 text-sm leading-6 text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="size-4 text-primary" />
                AI only helps with parsing and normalization.
              </div>
              <p className="mt-2">
                No prices, maps, or market comparisons are generated in this step. You&apos;ll
                review every item before we save the draft locally.
              </p>
            </div>

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
                  Building your list
                </>
              ) : (
                <>
                  Build my list
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="gap-5">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  Review parsed items
                </Badge>
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  {formatFrequencyLabel(reviewDraft.frequency)}
                </Badge>
                <Badge className="rounded-full px-3 py-1" variant="secondary">
                  {reviewDraft.radiusKm} km
                </Badge>
              </div>
              <CardTitle className="text-2xl">{reviewDraft.name}</CardTitle>
              <CardDescription>
                Confirm the parsed groceries below, fix anything that looks off, then save
                the draft and continue into compare markets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviewDraft.parseWarning ? (
                <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="size-4" />
                    Backup parser used
                  </div>
                  <p className="mt-2">{reviewDraft.parseWarning}</p>
                </div>
              ) : (
                <div className="rounded-[1.35rem] border border-primary/10 bg-primary/5 px-4 py-4 text-sm leading-6 text-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="size-4 text-primary" />
                    AI parsing completed
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    The list was parsed with structured output. You can still edit every item
                    before saving.
                  </p>
                </div>
              )}

              <div className="rounded-[1.35rem] bg-secondary px-4 py-4 text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">Original text:</span>{" "}
                {reviewDraft.sourceText}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => setReviewDraft(null)}
                  type="button"
                  variant="outline"
                >
                  <RefreshCcw className="size-4" />
                  Edit original text
                </Button>
                <Button onClick={handleAddItem} type="button" variant="ghost">
                  <Plus className="size-4" />
                  Add item manually
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {reviewDraft.parsedItems.map((item) => (
              <ReviewItemCard
                item={item}
                key={item.id}
                onChange={handleReviewItemChange}
                onRemove={handleRemoveReviewItem}
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
                Saving your list
              </>
            ) : (
              <>
                Confirm list and continue
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
