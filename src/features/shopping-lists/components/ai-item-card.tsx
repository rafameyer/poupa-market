"use client";

import {
  Check,
  ChevronDown,
  Minus,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  SHOPPING_ITEM_UNITS,
  type ItemSuggestionGroup,
  type ItemSuggestionOption,
  type ParsedShoppingItem,
  type ShoppingItemUnit,
} from "@/types/shopping-list";

interface AiItemCardMessages {
  suggested: string;
  needsCheck: string;
  looksGood: string;
  missingQuantity: string;
  removeItem: string;
  unit: string;
  whichOne: string;
  howMany: string;
  whichUnit: string;
}

interface AiItemCardProps {
  item: ParsedShoppingItem;
  messages: AiItemCardMessages;
  onApplySuggestion: (itemId: string, groupId: string, option: ItemSuggestionOption) => void;
  onMarkReviewed: (itemId: string) => void;
  onNameChange: (itemId: string, name: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onUnitChange: (itemId: string, unit: ShoppingItemUnit) => void;
}

function formatQuantity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "");
}

function getPromptLabel(group: ItemSuggestionGroup, messages: AiItemCardMessages) {
  const promptLabels: Record<ItemSuggestionGroup["promptKey"], string> = {
    whichOne: messages.whichOne,
    howMany: messages.howMany,
    whichUnit: messages.whichUnit,
  };

  return promptLabels[group.promptKey];
}

function getQuantityStep(unit: ShoppingItemUnit) {
  return unit === "kg" || unit === "L" ? 0.5 : 1;
}

export function AiItemCard({
  item,
  messages,
  onApplySuggestion,
  onMarkReviewed,
  onNameChange,
  onQuantityChange,
  onRemove,
  onUnitChange,
}: AiItemCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const activeSuggestionGroup = item.suggestionGroups[0] ?? null;
  const step = getQuantityStep(item.unit);
  const statusLabel = item.quantity <= 0
    ? messages.missingQuantity
    : item.needsReview
      ? messages.needsCheck
      : messages.suggested;

  function commitNameChange() {
    const trimmedName = draftName.trim();

    if (trimmedName) {
      onNameChange(item.id, trimmedName);
    } else {
      setDraftName(item.name);
    }

    setIsEditingName(false);
  }

  return (
    <article
      className={cn(
        "rounded-[1.45rem] border bg-card px-4 py-4 shadow-[0_12px_30px_rgba(45,33,16,0.04)]",
        item.needsReview
          ? "border-amber-200/80 bg-amber-50/75"
          : "border-white/80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                className="h-10 rounded-full bg-white/80 px-4"
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitNameChange();
                  }
                }}
                value={draftName}
              />
              <Button
                aria-label={messages.looksGood}
                onClick={commitNameChange}
                size="icon-xs"
                type="button"
              >
                <Check className="size-4" />
              </Button>
            </div>
          ) : (
            <button
              className="flex max-w-full items-center gap-2 text-left"
              onClick={() => {
                setDraftName(item.name);
                setIsEditingName(true);
              }}
              type="button"
            >
              <span className="truncate text-lg font-semibold tracking-[-0.01em] text-foreground">
                {item.name}
              </span>
              <Pencil className="size-3.5 shrink-0 text-muted-foreground" />
            </button>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full px-2.5 py-1 text-[0.7rem]" variant="secondary">
              {item.category.replace("-", " ")}
            </Badge>
            <Badge
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.7rem]",
                item.needsReview
                  ? "border-amber-200 bg-amber-100 text-amber-900"
                  : "border-emerald-100 bg-emerald-50 text-emerald-800",
              )}
              variant="outline"
            >
              <Sparkles className="size-3" />
              {statusLabel}
            </Badge>
          </div>
        </div>

        <Button
          aria-label={`${messages.removeItem}: ${item.name}`}
          onClick={() => onRemove(item.id)}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-full border border-white/80 bg-white/80 p-1.5">
        <div className="flex items-center gap-2">
          <Button
            aria-label={`Decrease ${item.name}`}
            disabled={item.quantity <= step}
            onClick={() => onQuantityChange(item.id, Math.max(step, item.quantity - step))}
            size="icon-xs"
            type="button"
            variant="secondary"
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="min-w-10 text-center text-base font-semibold text-foreground">
            {formatQuantity(item.quantity)}
          </span>
          <Button
            aria-label={`Increase ${item.name}`}
            onClick={() => onQuantityChange(item.id, item.quantity + step)}
            size="icon-xs"
            type="button"
            variant="secondary"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>

        <label className="relative">
          <span className="sr-only">{messages.unit}</span>
          <select
            className="h-9 appearance-none rounded-full border border-border bg-card py-1 pl-4 pr-9 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15"
            onChange={(event) => onUnitChange(item.id, event.target.value as ShoppingItemUnit)}
            value={item.unit}
          >
            {SHOPPING_ITEM_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </label>
      </div>

      {activeSuggestionGroup ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {getPromptLabel(activeSuggestionGroup, messages)}
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSuggestionGroup.options.map((option) => (
              <Button
                className="h-9 rounded-full px-3 text-xs"
                key={option.id}
                onClick={() => onApplySuggestion(item.id, activeSuggestionGroup.id, option)}
                type="button"
                variant="outline"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      ) : item.needsReview ? (
        <div className="mt-4">
          <Button
            className="h-9 rounded-full px-3 text-xs"
            onClick={() => onMarkReviewed(item.id)}
            type="button"
            variant="outline"
          >
            <Check className="size-3.5" />
            {messages.looksGood}
          </Button>
        </div>
      ) : null}
    </article>
  );
}
