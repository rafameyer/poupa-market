"use client";

import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type {
  ShoppingListFrequency,
  ShoppingListStatus,
} from "@/types/shopping-list";
import type { ShoppingListWithItems } from "@/features/shopping-lists/storage";

interface ShoppingListCardProps {
  entry: ShoppingListWithItems;
  frequencyLabelMap: Record<ShoppingListFrequency, string>;
  statusLabelMap: Record<ShoppingListStatus, string>;
  kilometersLabel: string;
  itemsLabel: string;
  onOpen: () => void;
}

function getStatusClasses(status: ShoppingListStatus) {
  if (status === "completed") {
    return "border-[#F0D98A] bg-[#FFF4CC] text-[#8C6A00]";
  }

  if (status === "active") {
    return "border-emerald-100 bg-emerald-50 text-emerald-800";
  }

  return "border-border bg-secondary text-muted-foreground";
}

export function ShoppingListCard({
  entry,
  frequencyLabelMap,
  statusLabelMap,
  kilometersLabel,
  itemsLabel,
  onOpen,
}: ShoppingListCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer gap-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(45,33,16,0.08)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20",
        entry.list.status === "completed"
          ? "border-[#F0D98A]/75 bg-[#FFF9E8]"
          : "hover:border-primary/20",
      )}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full px-3 py-1" variant="secondary">
                {frequencyLabelMap[entry.list.frequency]}
              </Badge>
              <Badge
                className={cn("rounded-full px-3 py-1", getStatusClasses(entry.list.status))}
                variant="outline"
              >
                {statusLabelMap[entry.list.status]}
              </Badge>
            </div>
            <CardTitle className="truncate text-lg">{entry.list.name}</CardTitle>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Pencil className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-secondary px-3 py-1">
            {entry.list.radiusKm} {kilometersLabel}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1">
            {entry.items.length} {itemsLabel}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {entry.items.slice(0, 4).map((item) => (
            <Badge className="rounded-full px-3 py-1" key={item.id} variant="secondary">
              {item.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
